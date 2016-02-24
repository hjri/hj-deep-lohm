/* global d3 */
var startingPos = [55.755347, 37.711664],

    projection = d3.geo.orthographic()
    .scale(250)
    .clipAngle(90),

    area = d3.geo.path()
    .projection(projection),

    land = d3.geo.path()
    .projection(projection),

    svg = d3.select('#map').append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 960 500"),

    objects = [],

    processObject = function(obj) {
        obj.loc = _.zipWith(calcDirection(obj.dir, obj.speed), obj.loc, function(a, b) {
            return a + b;
        });
        obj.xy = projection(obj.loc);
        return obj;
    },

    begin = function() {
        objects.push({
            loc: startingPos,
            dir: 0,
            speed: 0.2
        });
        objects.push({
            loc: [55, 30],
            dir: 90,
            speed: 0.1
        });
        setInterval(function() {
            var us = objects[0],
                usLoc = us.loc;

            rotate([usLoc[1], usLoc[0]]);
            objects = objects.map(function(o) {
                return processObject(o);
            });
        }, 20);
    },

    renderObjects = function(objects) {
        var object = svg.selectAll('.object')
            .data(objects);

        var grp = object.enter()
            .append('svg')
            .classed('object', true)
            .attr('viewbox', '-30 -30 300 300');

        grp.append('text')
            .classed('icon', true)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'FontAwesome')
            .attr('font-size', '20px')
            .attr('x', 16)
            .attr('y', 16)
            .text('\uf072');

        object.select('.icon')
            .attr('transform', function(d) {
                return 'rotate(' + (-d.dir + 45) + ' 16,16)';
            });

        object
            .attr('x', function(d) {
                return d.xy && d.xy[0] - 8;
            })
            .attr('y', function(d) {
                return d.xy && d.xy[1] - 8;
            });
    },

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
            .datum({
                type: "LineString",
                coordinates: calcArea(startingPos, 400 * 1000)
            })
            .attr('d', area);
        renderObjects(objects);
    },

    toDegrees = function(angle) {
        return angle * (180 / Math.PI);
    },

    toRadians = function(angle) {
        return angle * (Math.PI / 180);
    },

    calcDirection = function(course, speed) {
        var courseDeg = toRadians(course),
            latComp = Math.sin(courseDeg),
            lonComp = Math.cos(courseDeg);
        return [lonComp * speed, latComp * speed];
    },

    calcPoint = function(coords, offset) {
        var R = 6378137,
            lat = coords[0],
            lon = coords[1],
            dLat = offset[0] / R,
            dLon = offset[1] / (R * Math.cos(Math.PI * lat / 180));

        return [(lon + dLon * 180 / Math.PI), (lat + dLat * 180 / Math.PI)];
    },

    calcArea = function(coords, range) {
        return [
            [range, range],
            [range, -range],
            [-range, -range],
            [-range, range]
        ].map(function(point) {
            return calcPoint(coords, point);
        });
    },

    update = function(newPos) {
        startingPos = newPos;
        rotate(startingPos);
    };


d3.json('../libs_client/world-110m.json', function(error, world) {
    if (error) throw error;
    svg.append('path')
        .datum(topojson.feature(world, world.objects.land))
        .attr('class', 'land')
        .attr('d', land);
    svg.append('path')
        .datum({
            type: "LineString",
            coordinates: calcArea(startingPos, 400 * 1000)
        })
        .attr('class', 'area')
        .attr('d', area);

});

rotate(startingPos);
