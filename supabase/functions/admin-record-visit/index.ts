import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RecordVisitRequest {
  date: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { date }: RecordVisitRequest = await req.json();

    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Date is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existing } = await supabase
      .from('visitor_stats')
      .select('*')
      .eq('date', date)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('visitor_stats')
        .update({ visitors: existing.visitors + 1 })
        .eq('date', date);

      if (error) {
        console.error('Update error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to record visit' }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } else {
      const { error } = await supabase
        .from('visitor_stats')
        .insert({ date, visitors: 1 });

      if (error) {
        console.error('Insert error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to record visit' }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Visit recorded' }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});