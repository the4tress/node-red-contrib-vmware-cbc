const https = require('https')

module.exports = function(RED) {
    function SearchDevicesNode(config) {
        RED.nodes.createNode(this,config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);

        var node = this;
        
        node.on('input', function(msg) {
            const data = JSON.stringify(msg.payload);
            let options = {
                hostname: this.server.domain,
                port: 443,
                path: `/appservices/v6/orgs/${this.server.orgKey}/devices/_search`,
                method: 'POST',
                headers: {
                    'X-Auth-Token': `${this.server.customApiKey}/${this.server.customApiId}`,
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }
            
            if (msg.params) { options.params = msg.params }

            const req = https.request(options, res => {
                // Start an empty string for the body. This will be built on as we iterate through the response parts.
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
                        node.send([msg, msg.payload.results, null]);
                    } else {
                        node.send([null, null, body])
                        console.error(body)
                        node.status({
                            text: `statusCode: ${res.statusCode}`,
                            fill: 'red'
                        })
                    }
                })
            })
            
            req.on('error', error => {
                node.send([null, null, error])
                console.error(error)
                node.status({
                    text: `statusCode: ${res.statusCode}`,
                    fill: 'red'
                })
            })
            
            req.write(data)
            req.end()
        })
    }

    RED.nodes.registerType('search-devices', SearchDevicesNode);
}


