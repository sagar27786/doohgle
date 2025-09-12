import { pool } from "../db";

export interface Screen {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  screen_type:
    | "LED_billboard"
    | "mall_screen"
    | "metro_display"
    | "bus_stop"
    | "digital_hoarding";
  location_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  screen_size_width: number;
  screen_size_height: number;
  resolution_width: number;
  resolution_height: number;
  daily_footfall: number;
  vehicle_count: number;
  peak_hours: string;
  demographics: string;
  cost_per_10_seconds: number;
  is_active: boolean;
  image_url?: string;
  video_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ScreenSearchFilters {
  city?: string;
  state?: string;
  screen_type?: string;
  min_footfall?: number;
  max_budget?: number;
  location?: { lat: number; lng: number; radius: number };
}

export class ScreenModel {
  static async getAllScreens(): Promise<Screen[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM screens 
        WHERE is_active = true 
        ORDER BY created_at DESC
      `);
      // Map DB column names (screen_name, location_in_venue, screen_size_inches) to model fields
      return result.rows.map((r: any) => ({
        ...r,
        name: r.screen_name,
        location_name: r.location_in_venue,
        screen_size_width: r.screen_size_inches ?? null,
      }));
    } finally {
      client.release();
    }
  }

  static async getScreenById(id: number): Promise<Screen | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM screens WHERE id = $1 AND is_active = true",
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async searchScreens(filters: ScreenSearchFilters): Promise<Screen[]> {
    const client = await pool.connect();
    try {
      let query = "SELECT * FROM screens WHERE is_active = true";
      const params: any[] = [];
      let paramIndex = 1;

      if (filters.city) {
        query += ` AND LOWER(city) LIKE LOWER($${paramIndex})`;
        params.push(`%${filters.city}%`);
        paramIndex++;
      }

      if (filters.state) {
        query += ` AND LOWER(state) LIKE LOWER($${paramIndex})`;
        params.push(`%${filters.state}%`);
        paramIndex++;
      }

      if (filters.screen_type) {
        query += ` AND screen_type = $${paramIndex}`;
        params.push(filters.screen_type);
        paramIndex++;
      }

      if (filters.min_footfall) {
        query += ` AND daily_footfall >= $${paramIndex}`;
        params.push(filters.min_footfall);
        paramIndex++;
      }

      if (filters.max_budget) {
        query += ` AND cost_per_10_seconds <= $${paramIndex}`;
        params.push(filters.max_budget / 8640); // Convert daily budget to 10-second cost
        paramIndex++;
      }

      query += " ORDER BY created_at DESC";

      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getScreensByLocation(
    lat: number,
    lng: number,
    radius: number = 10
  ): Promise<Screen[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT *, 
               (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians($2)) + sin(radians($1)) * 
                sin(radians(latitude)))) AS distance
        FROM screens 
        WHERE is_active = true
        HAVING distance <= $3
        ORDER BY distance
      `,
        [lat, lng, radius]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async createScreen(
    screenData: Omit<Screen, "id" | "created_at" | "updated_at">
  ): Promise<Screen> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        INSERT INTO screens (
          user_id, name, description, screen_type, location_name, address, 
          city, state, pincode, latitude, longitude, screen_size_width, 
          screen_size_height, resolution_width, resolution_height, 
          daily_footfall, vehicle_count, peak_hours, demographics, 
          cost_per_10_seconds, is_active, image_url, video_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        RETURNING *
      `,
        [
          screenData.user_id,
          screenData.name,
          screenData.description,
          screenData.screen_type,
          screenData.location_name,
          screenData.address,
          screenData.city,
          screenData.state,
          screenData.pincode,
          screenData.latitude,
          screenData.longitude,
          screenData.screen_size_width,
          screenData.screen_size_height,
          screenData.resolution_width,
          screenData.resolution_height,
          screenData.daily_footfall,
          screenData.vehicle_count,
          screenData.peak_hours,
          screenData.demographics,
          screenData.cost_per_10_seconds,
          screenData.is_active,
          screenData.image_url,
          screenData.video_url,
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async updateScreen(
    id: number,
    screenData: Partial<Screen>
  ): Promise<Screen | null> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(screenData).filter((key) => key !== "id");
      const values = fields.map((field) => screenData[field as keyof Screen]);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(", ");

      const result = await client.query(
        `
        UPDATE screens 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 
        RETURNING *
      `,
        [id, ...values]
      );

      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async deleteScreen(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "UPDATE screens SET is_active = false WHERE id = $1",
        [id]
      );
      return (result.rowCount ?? 0) > 0;
    } finally {
      client.release();
    }
  }
}
