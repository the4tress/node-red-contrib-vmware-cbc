const https = require('https')

module.exports = function(RED) {
    function GetNotesNode(config) {
        RED.nodes.createNode(this,config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);

        var node = this;
        
        node.on('input', function(msg) {
            const options = {
                hostname: this.server.domain,
                port: 443,
                path: '/appservices/v6/orgs/' + this.server.orgKey + '/alerts/' + msg.alertId + '/notes',
                method: 'GET',
                headers: {
                    'X-Auth-Token': this.server.customApiKey + '/' + this.server.customApiId,
                    'Content-Type': 'application/json'
                }
            }
            
            const req = https.request(options, res => {
                let body = '';
                
                res.on('data', d => {
                    body += d.toString();
                }).on('end', () => {                    
                    if (res.statusCode == 200) {
                        node.status({
                            text: `statusCode: ${res.statusCode}`,
                            fill: 'green'
                        })

                        const schema = JSON.parse(body);
                        msg.payload = schema;
                        node.send(msg);
                    } else {
                        node.send(body)
                        console.error(body)
                        node.status({
                            text: `statusCode: ${res.statusCode}`,
                            fill: 'red'
                        })
                    }
                })
            })
            
            req.on('error', error => {
                node.send(error)
                console.error(error)
                node.status({
                    text: `statusCode: ${res.statusCode}`,
                    fill: 'red'
                })
            })
            
            req.end()
        })
    }

    RED.nodes.registerType('get-notes', GetNotesNode);
}


