const https = require('https')

module.exports = function(RED) {
    function CloseSessionNode(config) {
        RED.nodes.createNode(this,config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);

        var node = this;
        
        if (msg.session_id) {
            msg.payload = {
                session_id: msg.session_id,
                status: 'CLOSE'
            };
        }

        node.on('input', function(msg) {
            node.status({
                text: 'closing session...',
                fill: 'grey'
            })
            
            const data = JSON.stringify(msg.payload);
            const options = {
                hostname: this.server.domain,
                port: 443,
                path: '/integrationServices/v3/cblr/session',
                method: 'PUT',
                headers: {
                    'X-Auth-Token': `${this.server.liveResponse_api_key}/${this.server.liveResponse_api_id}`,
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }
            
            const req = https.request(options, res => {
                // Start an emptry string for the body. This will be built on as we iterate through the response parts.
                let body = '';
                
                // Add the response data to the body
                res.on('data', data => {
                    body += data.toString();
                }).on('end', () => {                    
                    // A 204 is a success
                    if (res.statusCode == 204) {
                        node.status({
                            text: `statusCode: ${res.statusCode}`,
                            fill: 'green'
                        })
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
            
            req.write(data)
            req.end()
        })
    }

    RED.nodes.registerType('close-session', CloseSessionNode);
}


