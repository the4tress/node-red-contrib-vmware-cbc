module.exports = function(RED) {
    function CarbonBlackCloudNode(n) {
        RED.nodes.createNode(this, n);

        if (n.domain.indexOf('://') >= 0) {
            this.domain = n.domain.substr(n.domain.indexOf('://') +3, n.domain.length)
        } else {
            this.domain = n.domain;
        }
        this.orgKey = n.orgKey;
        this.customApiId = n.customApiId;
        this.customApiKey = n.customApiKey;
        this.apiId = n.apiId;
        this.apiKey = n.apiKey;
        this.liveResponseApiId = n.liveResponseApiId;
        this.liveResponseApiKey = n.liveResponseApiKey;
    }

    RED.nodes.registerType("carbon-black-cloud", CarbonBlackCloudNode);
}