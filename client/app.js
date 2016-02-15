var c, canvas, height, path, projection, ready, title, width;

width = 960;

height = 960;

projection = d3.geo.orthographic().translate([width / 2, height / 2]).scale(width / 2 - 20).clipAngle(90).precision(0.6);

canvas = d3.select('#map').append('canvas').attr('width', width).attr('height', height);

c = canvas.node().getContext('2d');

path = d3.geo.path().projection(projection).context(c);

title = d3.select('h1');

ready = function() {
  var borders, countries, globe, i, land, n, world;
  world = d3.json('../client_libs/world-110m.json');
  globe = {
    type: 'Sphere'
  };
  land = topojson.feature(world, world.objects.land);
  countries = topojson.feature(world, world.objects.countries).features;
  borders = topojson.mesh(world, world.objects.countries, function(a, b) {
    return a !== b;
  });
  i = -1;
  n = countries.length;
  (function() {
    d3.transition().duration(1250).each('start', function() {
      title.text(countries[i = (i + 1) % n].name);
    }).tween('rotate', function() {
      var p, r;
      p = d3.geo.centroid(countries[i]);
      r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
      return function(t) {
        projection.rotate(r(t));
        c.clearRect(0, 0, width, height);
        c.fillStyle = '#ccc';
        c.beginPath();
        path(land);
        c.fill();
        c.fillStyle = '#f00';
        c.beginPath();
        path(countries[i]);
        c.fill();
        c.strokeStyle = '#fff';
        c.lineWidth = .5;
        c.beginPath();
        path(borders);
        c.stroke();
        c.strokeStyle = '#000';
        c.lineWidth = 2;
        c.beginPath();
        path(globe);
        c.stroke();
      };
    }).transition().each('end', transition);
  })();
};

ready();
