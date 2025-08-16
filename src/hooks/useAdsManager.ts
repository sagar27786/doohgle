// React Hooks for Ads Manager - Backend Integration
import { useState, useEffect, useCallback } from "react";
import {
  adsManagerAPI,
  Screen,
  Campaign,
  CampaignAnalytics,
  BudgetEstimate,
} from "../services/adsManagerService";

// Hook for screens data
export const useScreens = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScreens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adsManagerAPI.getAllScreens();
      setScreens(response.data || []);
    } catch (err) {
      setError("Failed to fetch screens");
      console.error("Error fetching screens:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScreens();
  }, [fetchScreens]);

  return { screens, loading, error, refetch: fetchScreens };
};

// Hook for screen search
export const useScreenSearch = () => {
  const [searchResults, setSearchResults] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchScreens = useCallback(
    async (params: {
      city?: string;
      location?: string;
      screenType?: string;
      minPrice?: number;
      maxPrice?: number;
      minFootfall?: number;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adsManagerAPI.searchScreens(params);
        setSearchResults(response.data || []);
      } catch (err) {
        setError("Failed to search screens");
        console.error("Error searching screens:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { searchResults, loading, error, searchScreens };
};

// Hook for campaigns data
export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(
    async (params?: { status?: string; page?: number; limit?: number }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adsManagerAPI.getUserCampaigns(params);
        setCampaigns(response.data || []);
      } catch (err) {
        setError("Failed to fetch campaigns");
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCampaignStatus = useCallback(
    async (campaignId: number, status: string) => {
      try {
        await adsManagerAPI.updateCampaignStatus(campaignId, status);
        // Update local state
        setCampaigns((prev) =>
          prev.map((campaign) =>
            campaign.id === campaignId
              ? { ...campaign, status: status as any }
              : campaign
          )
        );
        return true;
      } catch (err) {
        setError("Failed to update campaign status");
        console.error("Error updating campaign:", err);
        return false;
      }
    },
    []
  );

  const deleteCampaign = useCallback(async (campaignId: number) => {
    try {
      await adsManagerAPI.deleteCampaign(campaignId);
      // Remove from local state
      setCampaigns((prev) =>
        prev.filter((campaign) => campaign.id !== campaignId)
      );
      return true;
    } catch (err) {
      setError("Failed to delete campaign");
      console.error("Error deleting campaign:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    updateCampaignStatus,
    deleteCampaign,
  };
};

// Hook for campaign analytics
export const useCampaignAnalytics = (
  campaignId: number | null,
  days: number = 30
) => {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!campaignId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await adsManagerAPI.getCampaignAnalytics(campaignId, days);
      setAnalytics(data);
    } catch (err) {
      setError("Failed to fetch analytics");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [campaignId, days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};

// Hook for budget estimation
export const useBudgetEstimate = () => {
  const [estimate, setEstimate] = useState<BudgetEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimateBudget = useCallback(
    async (data: {
      screenIds: number[];
      startDate: string;
      endDate: string;
      timeSlots: string[];
    }) => {
      setLoading(true);
      setError(null);
      try {
        const budgetData = await adsManagerAPI.estimateBudget(data);
        setEstimate(budgetData);
      } catch (err) {
        setError("Failed to estimate budget");
        console.error("Error estimating budget:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { estimate, loading, error, estimateBudget };
};

// Hook for cities and filter options
export const useFilterOptions = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        const [citiesResponse, filtersResponse] = await Promise.all([
          adsManagerAPI.getCitiesList(),
          adsManagerAPI.getFilterOptions(),
        ]);

        setCities(citiesResponse.data || []);
        setFilterOptions(filtersResponse.data || {});
      } catch (err) {
        console.error("Error fetching filter options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  return { cities, filterOptions, loading };
};

// Hook for campaign creation
export const useCampaignCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCampaign = useCallback(
    async (data: {
      name: string;
      description: string;
      startDate: string;
      endDate: string;
      budget: number;
      targetAudience: string;
      selectedScreens: Array<{
        screenId: number;
        timeSlots: string[];
      }>;
      creatives: Array<{
        fileUrl: string;
        fileType: string;
        fileSize: number;
        duration?: number;
      }>;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adsManagerAPI.createCampaign(data);
        return response;
      } catch (err) {
        setError("Failed to create campaign");
        console.error("Error creating campaign:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createCampaign, loading, error };
};

// Hook for real-time data updates
export const useRealTimeUpdates = (interval: number = 30000) => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { lastUpdate };
};
