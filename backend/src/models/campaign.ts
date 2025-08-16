import { pool } from "../db";

export interface Campaign {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "draft" | "active" | "completed" | "paused" | "cancelled";
  total_budget: number;
  spent_amount: number;
  impressions: number;
  plays: number;
  screen_ids: number[];
  creative_urls: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface CampaignAnalytics {
  campaign_id: number;
  impressions: number;
  plays: number;
  total_spend: number;
  screen_performance: {
    screen_id: number;
    screen_name: string;
    plays: number;
    impressions: number;
    spend: number;
  }[];
}

export class CampaignModel {
  static async getAllCampaigns(userId?: number): Promise<Campaign[]> {
    const client = await pool.connect();
    try {
      let query = "SELECT * FROM campaigns ORDER BY created_at DESC";
      const params: any[] = [];

      if (userId) {
        query =
          "SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC";
        params.push(userId);
      }

      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getCampaignById(
    id: number,
    userId?: number
  ): Promise<Campaign | null> {
    const client = await pool.connect();
    try {
      let query = "SELECT * FROM campaigns WHERE id = $1";
      const params: any[] = [id];

      if (userId) {
        query += " AND user_id = $2";
        params.push(userId);
      }

      const result = await client.query(query, params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async createCampaign(
    campaignData: Omit<Campaign, "id" | "created_at" | "updated_at">
  ): Promise<Campaign> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Create campaign
      const campaignResult = await client.query(
        `
        INSERT INTO campaigns (
          user_id, name, description, start_date, end_date, status, 
          total_budget, spent_amount, impressions, plays, screen_ids, creative_urls
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `,
        [
          campaignData.user_id,
          campaignData.name,
          campaignData.description,
          campaignData.start_date,
          campaignData.end_date,
          campaignData.status,
          campaignData.total_budget,
          campaignData.spent_amount,
          campaignData.impressions,
          campaignData.plays,
          JSON.stringify(campaignData.screen_ids),
          JSON.stringify(campaignData.creative_urls),
        ]
      );

      const campaign = campaignResult.rows[0];

      // Create bookings for selected screens
      if (campaignData.screen_ids && campaignData.screen_ids.length > 0) {
        for (const screenId of campaignData.screen_ids) {
          await client.query(
            `
            INSERT INTO bookings (
              campaign_id, screen_id, start_date, end_date, total_amount, status
            ) VALUES ($1, $2, $3, $4, $5, $6)
          `,
            [
              campaign.id,
              screenId,
              campaignData.start_date,
              campaignData.end_date,
              campaignData.total_budget / campaignData.screen_ids.length,
              "confirmed",
            ]
          );
        }
      }

      await client.query("COMMIT");
      return campaign;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateCampaign(
    id: number,
    campaignData: Partial<Campaign>,
    userId?: number
  ): Promise<Campaign | null> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(campaignData).filter((key) => key !== "id");
      const values = fields.map((field) => {
        const value = campaignData[field as keyof Campaign];
        if (field === "screen_ids" || field === "creative_urls") {
          return JSON.stringify(value);
        }
        return value;
      });
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(", ");

      let query = `UPDATE campaigns SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`;
      const params = [id, ...values];

      if (userId) {
        query += " AND user_id = $" + (params.length + 1);
        params.push(userId);
      }

      query += " RETURNING *";

      const result = await client.query(query, params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async deleteCampaign(id: number, userId?: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      let query = "UPDATE campaigns SET status = $1 WHERE id = $2";
      const params = ["cancelled", id];

      if (userId) {
        query += " AND user_id = $3";
        params.push(userId);
      }

      const result = await client.query(query, params);
      return (result.rowCount || 0) > 0;
    } finally {
      client.release();
    }
  }

  static async getCampaignAnalytics(
    campaignId: number,
    userId?: number
  ): Promise<CampaignAnalytics | null> {
    const client = await pool.connect();
    try {
      // Get campaign basic info
      let campaignQuery = "SELECT * FROM campaigns WHERE id = $1";
      const campaignParams: any[] = [campaignId];

      if (userId) {
        campaignQuery += " AND user_id = $2";
        campaignParams.push(userId);
      }

      const campaignResult = await client.query(campaignQuery, campaignParams);
      if (campaignResult.rows.length === 0) return null;

      const campaign = campaignResult.rows[0];

      // Get screen performance data
      const screenPerformanceResult = await client.query(
        `
        SELECT 
          b.screen_id,
          s.name as screen_name,
          COALESCE(SUM(pp.plays), 0) as plays,
          COALESCE(SUM(pp.impressions), 0) as impressions,
          b.total_amount as spend
        FROM bookings b
        JOIN screens s ON b.screen_id = s.id
        LEFT JOIN proof_of_play pp ON b.id = pp.booking_id
        WHERE b.campaign_id = $1
        GROUP BY b.screen_id, s.name, b.total_amount
      `,
        [campaignId]
      );

      return {
        campaign_id: campaignId,
        impressions: campaign.impressions || 0,
        plays: campaign.plays || 0,
        total_spend: campaign.spent_amount || 0,
        screen_performance: screenPerformanceResult.rows,
      };
    } finally {
      client.release();
    }
  }

  static async updateCampaignMetrics(
    campaignId: number,
    impressions: number,
    plays: number
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `
        UPDATE campaigns 
        SET impressions = impressions + $1, plays = plays + $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `,
        [impressions, plays, campaignId]
      );
    } finally {
      client.release();
    }
  }

  static async calculateBudget(
    screenIds: number[],
    startDate: string,
    endDate: string
  ): Promise<number> {
    const client = await pool.connect();
    try {
      if (!screenIds || screenIds.length === 0) return 0;

      const result = await client.query(
        `
        SELECT SUM(cost_per_10_seconds) as total_cost_per_10_seconds
        FROM screens 
        WHERE id = ANY($1) AND is_active = true
      `,
        [screenIds]
      );

      const totalCostPer10Seconds =
        result.rows[0]?.total_cost_per_10_seconds || 0;

      // Calculate number of days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Assuming 10 plays per hour, 12 hours per day
      const totalPlays = days * 12 * 10;

      return totalCostPer10Seconds * totalPlays;
    } finally {
      client.release();
    }
  }
}
