import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialMedia: {
    email: string;
    linkedin: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    tiktok: string;
  };
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

    const contactInfo: ContactInfo = await req.json();

    if (!contactInfo.phone || !contactInfo.email || !contactInfo.address) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
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
      .from('contact_info')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('contact_info')
        .update({
          phone: contactInfo.phone,
          email: contactInfo.email,
          address: contactInfo.address,
          business_hours: contactInfo.businessHours,
          social_media: contactInfo.socialMedia,
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Update error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update contact info' }),
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
        .from('contact_info')
        .insert({
          phone: contactInfo.phone,
          email: contactInfo.email,
          address: contactInfo.address,
          business_hours: contactInfo.businessHours,
          social_media: contactInfo.socialMedia,
        });

      if (error) {
        console.error('Insert error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create contact info' }),
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
      JSON.stringify({ success: true, message: 'Contact info updated' }),
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