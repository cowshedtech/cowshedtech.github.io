export async function onRequest(context) {
    // Get the original response
    const response = await context.next();
    
    // Only process HTML documents
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return response;
    }
  
    // Get the environment variable
    const mixpanelToken = context.env.MIXPANEL_TOKEN;
    
    // Get the HTML content
    let html = await response.text();
    
    // Insert our script into the head
    const scriptToInject = `<script>window.MIXPANEL_TOKEN = "${mixpanelToken}"</script>`;
    html = html.replace('</head>', scriptToInject + '</head>');
    
    // Return modified response
    return new Response(html, {
      headers: response.headers
    });
  }