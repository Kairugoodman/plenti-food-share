import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FoodItem {
  id: string;
  donor_id: string;
  item_name: string;
  quantity: number;
  expiry_date: string;
  status: 'available' | 'matched' | 'collected';
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    location?: string;
  };
}

export interface CreateFoodItemData {
  item_name: string;
  quantity: number;
  expiry_date: string;
}

export function useFoodItems() {
  return useQuery({
    queryKey: ['food-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_items')
        .select(`
          *,
          profiles:donor_id (
            name,
            location
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FoodItem[];
    }
  });
}

export function useMyFoodItems() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-food-items', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FoodItem[];
    },
    enabled: !!user
  });
}

export function useCreateFoodItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateFoodItemData) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('food_items')
        .insert({
          ...data,
          donor_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items'] });
      queryClient.invalidateQueries({ queryKey: ['my-food-items'] });
    }
  });
}

export function useUpdateFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FoodItem> }) => {
      const { data, error } = await supabase
        .from('food_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items'] });
      queryClient.invalidateQueries({ queryKey: ['my-food-items'] });
    }
  });
}