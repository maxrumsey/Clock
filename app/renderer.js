const ipc = require('electron').ipcRenderer
var config = require('./config.json')
var days = require('./config.json').days
var timer, ah, am, alarmed
settime()

document.getElementById('alarm').addEventListener('click', function (event) {
  ah = document.getElementById('h').value
  am = document.getElementById('m').value
  ah = parseInt(ah, 10)
  am = parseInt(am, 10)
  if (decide(ah, am)) {
    document.getElementById('alarmsg').innerHTML = `Invalid`
    return
  }
  alarmed = false
  var h = ah + ""
  var m = am + ""
  if (h.length === 1) {h = "0" + h}
  if (m.length === 1) {m = "0" + m}
  document.getElementById('alarmsg').innerHTML = `Alarm set for <b>${h}:${m}</b>`
})

function settime() {
  var h, m, s, d
  h = new Date().getHours() + ""
  m = new Date().getMinutes() + ""
  s = new Date().getSeconds() + ""
  d = days[new Date().getDay()]
  if (h.length === 1) {h = "0" + h}
  if (m.length === 1) {m = "0" + m}
  if (s.length === 1) {s = "0" + s}
  var options = [
  {
    title: "Alarm",
    body: `The alarm at ${h}:${m} has been activated.`
  }]
  document.getElementById('response').innerHTML = `<b>${h}:${m}:${s} ${d}</b>`
  if (alarmed === true) {return}
  if ((ah === new Date().getHours()) && (am === new Date().getMinutes())) {new Notification(options[0].title, options[0]); ipc.send('open-information-dialog', `${ah}|${am}`); alarmed = true;}
}
timer = setInterval(function() { settime() }, config.refreshrate);

function decide(h, m) {
  if (isNaN(h) || isNaN(m)) {return true}
  if ((h > 23) || (h < 0)) {return true}
  if ((m > 59) || (m < 0)) {return true}
  h = h + ""
  m = m + ""
  if ((h.length < 1) || (h.length > 2)) {return true}
  if ((m.length < 1) || (m.length > 2)) {return true}
  return false

}
