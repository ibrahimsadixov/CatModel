const myData = document.getElementById("myData")
const upload = document.getElementById("upload")
const closing = document.getElementById("close")


upload.addEventListener("click", () => {
   myData.classList.toggle("open");
   closing.classList.toggle("closing")
})
closing.addEventListener("click", () => {
   closing.classList.remove("closing")
   myData.classList.remove("open");
})




