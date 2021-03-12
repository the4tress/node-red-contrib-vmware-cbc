# Overview

This is a collection of nodes for working with the [VMware Carbon Black Cloud APIs](https://developer.carbonblack.com). This is a growing collection for quick prototyping of proof of concept integrations.

It is not supported by VMware.

Please submit any issues to the Github repo or submit a pull request with changes.

# Install

Either use the Menu > Manage Palette > Install option or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm i node-red-contrib-vmware-cbc

# Usage

These nodes are just wrappers for the API query. Any endpoint that requires a request body should be submitted as `msg.payload`. Some endpoints require a request body and something else (like a `feed_id`). To know what inputs are expected see the documentation for each node. It will have a description, link to the official documentation, and a list of inputs and outputs.

The first time you use these nodes you will need to configure a CBC server with API credentials. Not all fields are required, but you should understand which endpoints use which API key types. If you get a 403 (authentication) error, make sure the API type is populated and has the correct access level.

These nodes are generally designed to work well with each other. For example, some APIs need to work together (like Process Search). These nodes will output the primary field of interest (typically the `id`) as its own element in the `msg` object (i.e. `msg.jobId`). This is the same structure as is expected by the follow-up call.

If you find any opportunities for improvement let me know. This is a community project to help articulate the possibilities with the APIs.

# Development

I included my VScode custom Snippets. These can be used to quickly create new endpoints. Just type `nr` and select from the options. Everything uses one html template, and there are JS templates for `GET`, `POST`, and `DELETE` requests.