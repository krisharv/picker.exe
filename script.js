var opts = [];
var selMood = null;
var selCat = null;
var spinning = false;
var wheelRot = 0;
var wheelSpd = 0;

var wColors = ["#39ff14", "#ff2b2b", "#ffb300", "#00cfff", "#ff69b4", "#c8ff00", "#ff6600", "#a0ff60"];

// ---- OPTIONS ----

function addOption() {
    var el = document.getElementById("optionInput");
    var val = el.value.trim();
    if (!val) { alert("type something first 💀"); return; }
    if (opts.length >= 10) { alert("10 is enough bro. decide faster."); return; }
    opts.push(val);
    el.value = "";
    renderOpts();
    drawWheel();
}

function removeOpt(i) {
    opts.splice(i, 1);
    renderOpts();
    drawWheel();
}

function clearAllOptions() {
    if (!opts.length) return;
    if (!confirm("delete all? u sure?")) return;
    opts = [];
    renderOpts();
    drawWheel();
}

function renderOpts() {
    var ul = document.getElementById("optionsList");
    ul.innerHTML = "";
    if (!opts.length) {
        ul.innerHTML = '<li class="empty-hint">nothing here yet. type something above.</li>';
        return;
    }
    opts.forEach(function (o, i) {
        var li = document.createElement("li");
        li.className = "option-item";
        li.innerHTML = '<span class="opt-num">' + (i + 1) + '.</span>'
            + '<span class="opt-text">' + o + '</span>'
            + '<button class="opt-del" onclick="removeOpt(' + i + ')">DEL</button>';
        ul.appendChild(li);
    });
}

document.getElementById("optionInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") addOption();
});

// ---- CHIPS ----

function pickChip(el, type) {
    var gid = type === "mood" ? "moodGroup" : "catGroup";
    document.getElementById(gid).querySelectorAll(".chip").forEach(function (c) {
        c.classList.remove("on");
    });
    el.classList.add("on");
    if (type === "mood") selMood = el.getAttribute("data-mood");
    else selCat = el.getAttribute("data-cat");
}

// ---- DECISION ENGINE ----

var reasons = {
    lazy_food: ["easiest thing on the list. no effort required.", "delivery > cooking. always.", "minimum viable meal."],
    lazy_movies: ["something to nap to.", "background noise content selected.", "comfort watch unlocked."],
    lazy_study: ["bro. lazy AND study?? ok fine.", "just open the book at least.", "one paragraph. thats all."],
    lazy_general: ["the universe picked. not you.", "random. like ur life choices.", "destiny said this one."],
    healthy_food: ["alphabetically first = nutritionally superior (logic)", "green flag option.", "ur body said thanks (probably)"],
    healthy_movies: ["wholesome pick. no brainrot today.", "something that wont rot ur neurons.", "clean content activated."],
    healthy_study: ["LETS GOOO. productive mode.", "peak performance option.", "ur actually studying. respect."],
    healthy_general: ["optimal. scientifically. (i made this up)", "best for ur wellbeing. trust.", "healthy and valid."],
    fun_food: ["chaotic food choice. live a little.", "treat urself. its basically a holiday.", "yolo cuisine."],
    fun_movies: ["entertainment MAXIMIZED.", "popcorn mandatory.", "cinema mode: activated."],
    fun_study: ["gamify it or dont do it.", "make it a vibe somehow.", "adhd studying begins now."],
    fun_general: ["random chaos pick. no regrets.", "the fun option. obviously.", "spontaneous. locked in."],
    quick_food: ["speed run meal.", "5 min or under energy.", "fastest thing on the menu."],
    quick_movies: ["runtime under 90min vibes.", "no 3hr epics today.", "quick watch selected."],
    quick_study: ["crash mode activated.", "last minute?? relatable.", "quick revision. go go go."],
    quick_general: ["fastest path selected.", "efficiency over everything.", "no time to waste bro."],
};

function makeDecision() {
    if (!opts.length) { showResult("???", "add options first lmao"); return; }
    var pool = opts.slice();
    var pick;
    if (selMood === "lazy") { pool = shuffle(pool); pick = pool[0]; }
    else if (selMood === "healthy") { pool.sort(); pick = pool[0]; }
    else if (selMood === "fun") { pool = shuffle(pool); pick = pool[pool.length - 1]; }
    else if (selMood === "quick") { pool.sort(function (a, b) { return a.length - b.length; }); pick = pool[0]; }
    else { pick = pool[Math.floor(Math.random() * pool.length)]; }

    var key = (selMood || "lazy") + "_" + (selCat || "general");
    var rList = reasons[key] || ["the algorithm has spoken. dont argue."];
    var r = rList[Math.floor(Math.random() * rList.length)];

    showResult(pick, "-> " + r);
    saveHist(pick, selMood, selCat);
}

function showResult(pick, why) {
    var el = document.getElementById("resultText");
    el.classList.remove("pop");
    void el.offsetWidth;
    el.textContent = pick;
    el.classList.add("pop");
    document.getElementById("whyText").textContent = why || "";
}