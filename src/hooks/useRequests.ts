import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Request {
  id: string;
  recipient_id: string;
  food_item_id: string;
  status: 'pending' | 'accepted' | 'completed';
  created_at: string;
  updated_at: string;
  food_items?: {
    id: string;
    item_name: string;
    quantity: number;
    expiry_date: string;
    donor_id: string;
    profiles?: {
      name: string;
      location?: string;
    };
  };
  profiles?: {
    name: string;
    location?: string;
  };
}

export function useMyRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          food_items (
            id,
            item_name,
            quantity,
            expiry_date,
            donor_id,
            profiles:donor_id (
              name,
              location
            )
          )
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Request[];
    },
    enabled: !!user
  });
}

export function useRequestsForMyFood() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['requests-for-my-food', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          profiles:recipient_id (
            name,
            location
          ),
          food_items!inner (
            id,
            item_name,
            quantity,
            expiry_date
          )
        `)
        .eq('food_items.donor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Request[];
    },
    enabled: !!user
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (food_item_id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('requests')
        .insert({
          recipient_id: user.id,
          food_item_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests-for-my-food'] });
    }
  });
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Request> }) => {
      const { data, error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests-for-my-food'] });
    }
  });
}