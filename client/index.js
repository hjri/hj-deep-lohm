/* global d3 */
var width = 960,
    height = 500,
    currentPos = [55.755347, 37.711664],

    projection = d3.geo.orthographic()
    .scale(250)
    .clipAngle(90),

    area = d3.geo.path()
        .projection(projection),

    land = d3.geo.path()
    .projection(projection),

    svg = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height),

    rotate = function(coords) {
        projection.rotate([-coords[1], -coords[0]]);
        render();
    },

    scale = function(scale) {
        projection.scale(scale);
        render();
    },

    render = function() {
        svg.selectAll('.land').attr('d', land);
        svg.selectAll('.area')
            .datum({ type: "LineString", coordinates: calcArea(currentPos, 400 * 1000)})
            .attr('d', area);
    },

    calcPoint = function(coords, offset) {
        var R = 6378137,
            lat = coords[0],
            lon = coords[1],
            dLat = offset[0] / R,
            dLon = offset[1] / (R * Math.cos(Math.PI * lat / 180));

        return [(lon + dLon * 180 / Math.PI ), (lat + dLat * 180 / Math.PI)];
    },

    calcArea = function(coords, range) {
        return [[range,range],[range,-range],[-range,-range],[-range,range]].map(function(point) {
            return calcPoint(coords,point);
        });
    },

    update = function(newPos) {
        currentPos = newPos;
        rotate(currentPos);
    };


d3.json('../libs_client/world-110m.json', function(error, world) {
    if (error) throw error;
    svg.append('path')
        .datum(topojson.feature(world, world.objects.land))
        .attr('class', 'land')
        .attr('d', land);
    svg.append('path')
        .datum({ type: "LineString", coordinates: calcArea(currentPos, 400 * 1000)})
        .attr('class','area')
        .attr('d', area);

});

rotate(currentPos);
