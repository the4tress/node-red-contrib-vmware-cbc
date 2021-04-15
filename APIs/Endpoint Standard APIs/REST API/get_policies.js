const https = require('https')

module.exports = function(RED) {
    function GetPoliciesNode(config) {
        RED.nodes.createNode(this,config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);

        var node = this;
        
        node.on('input', function(msg) {
            const options = {
                hostname: this.server.domain,
                port: 443,
                path: `/integrationServices/v3/policy`,
                method: 'GET',
                headers: {
                    'X-Auth-Token': `${this.server.api_key}/${this.server.api_id}`,
                    'Content-Type': 'application/json'
                }
            }
            
            const req = https.request(options, res => {
                // Start an emptry string for the body. This will be built on as we iterate through the response parts.
                let body = '';
                
                // Add the response data to the body
                res.on('data', data => {
                    body += data.toString();
                }).on('end', () => {                    
                    // A 200 is a success
                    if (res.statusCode == 200) {
                        node.status({
                            text: `statusCode: ${res.statusCode}`,
                            fill: 'green'
                        })

                        const schema = JSON.parse(body);
                        msg.payload = schema;
                        node.send([msg, null]);
                    } else {
                        node.send([null, body])
                        console.error(body)
                        node.status({
                            text: `statusCode: ${res.statusCode}`,
                            fill: 'red'
                        })
                    }
                })
            })
            
            req.on('error', error => {
                node.send([null, error])
                console.error(error)
                node.status({
                    text: `statusCode: ${res.statusCode}`,
                    fill: 'red'
                })
            })
            
            req.end()
        })
    }

    RED.nodes.registerType('get-policies', GetPoliciesNode);
}