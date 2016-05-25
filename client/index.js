/* global d3 */
var startingPos = [55.755347, 37.711664],
    R = 6378137,

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
            loc: [startingPos[1], startingPos[0]],
            dir: 0,
            speed: 0.01,
            id: 'Us'
        });
        objects.push({
            loc: [37.711664 , 55.755347 ],
            dir: 90,
            speed: 0.02,
            id: 'Test Plane 1'
        });
        objects.push({
            loc: [startingPos[1]+11.11, startingPos[0]+2.01],
            dir: 180,
            speed: 0.03,
            id: 'Test Plane 2'
        });
        objects.push({
            loc: [startingPos[1]+6.11, startingPos[0]-1.01],
            dir: 125,
            speed: 0.03,
            id: 'Test Plane 3'
        });
        objects.push({
            loc: [startingPos[1]-6.41, startingPos[0]-0.01],
            dir: 23,
            speed: 0.03,
            id: 'Test Plane 4'
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

        var circle = svg.selectAll('.circle');

        var grp = object.enter()
            .append('svg')
            .classed('object', true)
            .attr('viewbox', '-30 -30 300 300');

        object
            .classed('outOfRange', function(d) {
                return d === objects[0] ? false : calcDistanceMeters(toD3Geo(d.loc), toD3Geo(objects[0].loc)) > 400000;
            })
            .classed('hidden', function(d) {
                return d === objects[0] ? false : calcDistanceMeters(toD3Geo(d.loc), toD3Geo(objects[0].loc)) > 1200000;
            });

        grp.append('text')
            .classed('icon', true)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'FontAwesome')
            .attr('font-size', '20px')
            .attr('x', 16)
            .attr('y', 16)
            .text('\uf072');

        grp.append('text')
            .classed('icon', true)
            .attr('font-size', '20px')
            .attr('x', 8)
            .attr('y', 48)
            .text(function(d, i) {
                return d.id;
            });

        object.select('.icon')
            .attr('transform', function(d) {
                return 'rotate(' + (-d.dir + 45) + ' 16,16)';
            });

        object
            .attr('x', function(d) {
                return d.xy && d.xy[0] - 16;
            })
            .attr('y', function(d) {
                return d.xy && d.xy[1] - 16;
            });

        circle.append('circle')
            .attr('r', 500);

        circle
            .attr('cx', function(d) {
                return objects[0].xy && objects[0].xy[0];
            })
            .attr('cy', function(d) {
                return objects[0].xy && objects[0].xy[1];
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
        // svg.selectAll('.area')
            // .datum({
                // type: "LineString",
                // coordinates: calcArea(startingPos, 400 * 1000)
            // })
            // .attr('d', area);
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

    calcRadius = function(coords, range) {
        var nextPoint = calcPoint(coords, [0, range]);

        debugger;
    },

    toD3Geo = function(coords) {
        return [coords[1], coords[0]];
    },

    calcDistanceMeters = function(a, b) {
        return d3.geo.distance(a, b) * R;
    },

    calcPoint = function(coords, offset) {
        var lat = coords[0],
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
    svg.append('circle')
        .attr('class', 'circle')
        .attr('r', '100');
    // svg.append('path')
    //     .datum({
    //         type: "LineString",
    //         coordinates: calcArea(startingPos, 400 * 1000)
    //     })
    //     .attr('class', 'area')
    //     .attr('d', area);

});

rotate(startingPos);
scale(2000)
begin();
