import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  currency: string;
  payment_type: 'donation' | 'delivery_fee';
  donor_id?: string;
  recipient_id?: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing IntaSend payment request');

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const {
      amount,
      currency = 'KES',
      payment_type,
      donor_id,
      recipient_id,
      phone_number,
      email,
      first_name,
      last_name
    }: PaymentRequest = await req.json();

    // Validate required fields
    if (!amount || !phone_number || !email || !first_name || !last_name) {
      throw new Error("Missing required payment fields");
    }

    // Initialize IntaSend payment
    const intasendUrl = 'https://sandbox.intasend.com/api/v1/payment/mpesa-stk-push/';
    const publicKey = Deno.env.get('INTASEND_PUBLIC_KEY');
    const privateKey = Deno.env.get('INTASEND_PRIVATE_KEY');

    if (!publicKey || !privateKey) {
      throw new Error("IntaSend credentials not configured");
    }

    // Create payment request to IntaSend
    const paymentData = {
      public_key: publicKey,
      amount: amount,
      currency: currency,
      mobile_number: phone_number,
      email: email,
      api_ref: `${payment_type}_${Date.now()}`,
      first_name: first_name,
      last_name: last_name,
      host: req.headers.get("origin") || "https://your-app.com"
    };

    console.log('Sending payment request to IntaSend:', paymentData);

    const intasendResponse = await fetch(intasendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${privateKey}`,
      },
      body: JSON.stringify(paymentData),
    });

    const intasendResult = await intasendResponse.json();
    console.log('IntaSend response:', intasendResult);

    if (!intasendResponse.ok) {
      throw new Error(`IntaSend API error: ${intasendResult.message || 'Payment failed'}`);
    }

    // Record transaction in database using service role key to bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: dbError } = await supabaseService.from('transactions').insert({
      user_id: user.id,
      amount: amount,
      type: payment_type,
      date: new Date().toISOString()
    });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to record transaction: ${dbError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      payment_id: intasendResult.id || intasendResult.payment_id,
      checkout_url: intasendResult.checkout_url,
      message: 'Payment initiated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in process-payment function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});