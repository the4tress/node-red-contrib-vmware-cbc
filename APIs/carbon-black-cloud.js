module.exports = function(RED) {
    function CarbonBlackCloudNode(n) {
        RED.nodes.createNode(this, n);

        if (n.domain.indexOf('://') >= 0) {
            this.domain = n.domain.substr(n.domain.indexOf('://') +3, n.domain.length)
        } else {
            this.domain = n.domain;
        }
        this.org_key = n.org_key;
        this.custom_api_id = n.custom_api_id;
        this.custom_api_key = n.custom_api_key;
        this.apiId = n.apiId;
        this.apiKey = n.apiKey;
        this.liveResponseApiId = n.liveResponseApiId;
        this.liveResponseApiKey = n.liveResponseApiKey;
    }

    RED.nodes.registerType("carbon-black-cloud", CarbonBlackCloudNode);
}