enablePlugins(ScalaJSPlugin)

name := "Deep Lohm ScalaJS Code"

scalaVersion := "2.11.7" // or any other Scala version >= 2.10.2
scalaSource in Compile := baseDirectory.value / "src/scalajs"
libraryDependencies ++= Seq(
    "org.scala-js" %%% "scalajs-dom" % "0.9.0",
    "org.singlespaced" %%% "scalajs-d3" % "0.2.0",
    "com.lihaoyi" %%% "utest" % "0.3.0" % "test"
)


jsDependencies += RuntimeDOM

skip in packageJSDependencies := false

persistLauncher in Compile := true
persistLauncher in Test := false
