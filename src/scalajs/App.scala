package tutorial.webapp
import scala.scalajs.js
import scala.scalajs.dom
import scala.scalajs.js.JSApp
import org.singlespaced.d3js.Ops._
import org.singlespaced.d3js.d3

object TutorialApp extends JSApp {

  def main(): Unit = {
    val c = d3.rgb("DarkSlateBlue")

    val size = (800,600)
    val projection = d3.geo.orthographic()
      .translate(((size._1 / 2).toDouble, (size._2 / 2).toDouble))
      .scale( (size._1 / 2 - 20).toDouble )
      .clipAngle(90)
      .precision(0.6)

    val canvas = d3.select("#map").append("canvas")
      .attr("width","100%")
      .attr("height","100%")

    val ctx2d = canvas.node()


  }
}
