export async function onRequest(context) {
    // Get the original response
    const response = await context.next();

    console.error(`here1`)
    
    // Only process HTML documents
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return response;
    }
  
    // // Get the environment variable
    const token = context.env.MIXPANEL_TOKEN;
    console.error(`token [${token}]`)
    
    // // Get the HTML content
    let html = await response.text();
    
    // // Insert our script into the head
    const scriptToInject = `<script>window.MIXPANEL_TOKEN = "${token}";</script>`;
    console.error(`scriptToInject [${scriptToInject}]`)
    html = html.replace('</head>', scriptToInject + '</head>');

    console.error(`here2`)
    
    // Return modified response
    return new Response(html, {
      headers: response.headers
    });
  }