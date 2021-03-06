const https = require('https')

module.exports = function(RED) {
    function GetCommandStatusNode(config) {
        RED.nodes.createNode(this,config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);

        var node = this;
        
        node.on('input', function(msg) {
            node.status({
                text: 'getting command status...',
                fill: 'grey'
            })

            if (!msg.session_id) {
                node.send([null, body])
                console.error(body)
                node.status({
                    text: 'Missing session_id',
                    fill: 'red'
                })
            }

            if (!msg.command_id && msg.payload) { msg.command_id = msg.payload; }
            if (!msg.command_id) {
                node.send([null, body])
                console.error(body)
                node.status({
                    text: 'Missing command_id',
                    fill: 'red'
                })
            }

            else {
                const options = {
                    hostname: this.server.domain,
                    port: 443,
                    path: `/integrationServices/v3/cblr/session/${msg.session_id}/command/${msg.command_id}`,
                    method: 'GET',
                    headers: {
                        'X-Auth-Token': `${this.server.liveResponse_api_key}/${this.server.liveResponse_api_id}`,
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
                            console.error([null, body])
                            node.status({
                                text: `statusCode: ${res.statusCode}`,
                                fill: 'red'
                            })
                        }
                    })
                })
            
                req.on('error', error => {
                    node.send([null, error])
                    console.error([null, error])
                    node.status({
                        text: `statusCode: ${res.statusCode}`,
                        fill: 'red'
                    })
                })
                
                req.end()
            }
        })
    }

    RED.nodes.registerType('get-command-status', GetCommandStatusNode);
}


