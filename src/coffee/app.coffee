width = 960
height = 960
projection = d3.geo.orthographic().translate([ 
  width / 2
  height / 2
]).scale(width / 2 - 20).clipAngle(90).precision(0.6)

canvas = d3.select('#map')
.append('canvas')
.attr('width', width)
.attr('height', height)

c = canvas.node().getContext('2d')
path = d3.geo.path().projection(projection).context(c)
title = d3.select('h1')

ready = () ->
  world = d3.json('../client_libs/world-110m.json')
  globe = type: 'Sphere'
  land = topojson.feature(world, world.objects.land)
  countries = topojson.feature(world, world.objects.countries).features
  borders = topojson.mesh(world, world.objects.countries, (a, b) ->
    a != b
  )
  i = -1
  n = countries.length
  (->
    d3.transition().duration(1250).each('start', ->
      title.text countries[i = (i + 1) % n].name
      return
    ).tween('rotate', ->
      p = d3.geo.centroid(countries[i])
      r = d3.interpolate(projection.rotate(), [
        -p[0]
        -p[1]
      ])
      (t) ->
        projection.rotate r(t)
        c.clearRect 0, 0, width, height
        c.fillStyle = '#ccc'
        c.beginPath()
        path(land)
        c.fill()
        c.fillStyle = '#f00'
        c.beginPath()
        path(countries[i])
        c.fill()
        c.strokeStyle = '#fff'
        c.lineWidth = .5
        c.beginPath()
        path(borders)
        c.stroke()
        c.strokeStyle = '#000'
        c.lineWidth = 2
        c.beginPath()
        path(globe)
        c.stroke()
        return
    ).transition().each 'end', transition
    return
  )()
  return

ready()
