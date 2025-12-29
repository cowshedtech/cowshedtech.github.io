/*
* This code is used to inject Mixpanel token via cloudflare working
* It enables us to set mixpanel tokens as runtime config
*/

export async function onRequest(context) {
    // Get the original response
    const response = await context.next();

    
    // Only process HTML documents
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return response;
    }
  
    // // Get the environment variable
    const token = context.env.MIXPANEL_TOKEN;
    
    // // Get the HTML content
    let html = await response.text();
    
    // // Insert our script into the head
    const scriptToInject = `<script>window.MIXPANEL_TOKEN = "${token}";</script>`;
    html = html.replace('</head>', scriptToInject + '</head>');

    // Return modified response
    return new Response(html, {
      headers: response.headers
    });
  }