import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'donation' | 'payment';
  date: string;
  created_at: string;
}

export interface CreateTransactionData {
  amount: number;
  type: 'donation' | 'payment';
}

export function useMyTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateTransactionData) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('transactions')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-transactions'] });
    }
  });
}