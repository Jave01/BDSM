window.onload = function () {
    // set initial value
    let hero_select = $(".hero-select");
    hero_select.on("change", get_hero_and_update);
    hero_select.on("click", save_hero);
    if (hero_select.val() !== -1) {
        get_hero_and_update(hero_select);
    }

    setInterval(save_hero, 15000); // save hero ever 15 seconds
};

/**
 * Sends a post request to get the new hero values and sets them.
 * @param {*} obj jQuery event or select object
 */
async function get_hero_and_update(obj) {
    let name = "";
    try {
        name = obj.val();
    } catch (error) {
        name = obj.target.value;
    }

    await fetch("/data-request", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ "name": name }),
    })
        .then((res) => {
            if (res.ok) return res.json();
            else alert("Something went wront");
        })
        .then((jsonResponse) => {
            update_new_hero_stats(jsonResponse);
        });
}

/**
 * Send current values to webserver to save them in database
 * @param {*} evt
 */
async function save_hero(obj) {
    let wealth = update_get_money();

    let hero_stats = newHeroObject(
        $("#lep").val(),
        $("#asp").val(),
        $("#kap").val(),
        $(".hero-select").val(),
        wealth
    );

    const response = await fetch("/save-hero", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(hero_stats),
    });

    return response;
}

/**
 * Handles the money change from a user input and returns the new values
 * @param {*} event
 */
function update_get_money() {
    let d = $("#money-d").val();
    let s = $("#money-s").val();
    let h = $("#money-h").val();
    let k = parseInt($("#money-k").val()); // idk why but it works only this way

    let total = d * 1000 + s * 100 + h * 10 + k;

    d = Math.floor(total / 1000);
    s = Math.floor((total % 1000) / 100);
    h = Math.floor((total % 100) / 10);
    k = Math.floor(total % 10);

    $("#money-d").val(d);
    $("#money-s").val(s);
    $("#money-h").val(h);
    $("#money-k").val(k);

    return { d, s, h, k };
}

/**
 * Reformat the total money and return it in a dictionary
 * @param {*} money
 * @returns money split up tp d, h, s, k
 */
function splitMoney(money) {
    if (money === 0) return { "d": 0, "s": 0, "h": 0, "k": 0 };

    let smoney = String(money);

    let d = Number(smoney.slice(0, smoney.length - 3));
    let remain = smoney.slice(smoney.length - 3);

    let s = Number(remain[0]);
    let h = Number(remain[1]);
    let k = Number(remain[2]);
    return { d, s, h, k };
}

/**
 * updates all the values on the screen with the values from the given hero
 * @param {*} hero hero in json format
 */
async function update_new_hero_stats(hero) {
    $("#lep-max").text(hero["lep_max"]);
    $("#asp-max").text(hero["asp_max"]);
    $("#kap-max").text(hero["kap_max"]);
    $("#lep").val(hero["lep_current"]);
    $("#asp").val(hero["asp_current"]);
    $("#kap").val(hero["kap_current"]);
    $("#money-d").val(hero["wealth"]["d"]);
    $("#money-s").val(hero["wealth"]["s"]);
    $("#money-h").val(hero["wealth"]["h"]);
    $("#money-k").val(hero["wealth"]["k"]);
    $("#armor").text(hero["armor"]);
    // $('#dodge').text(hero['dodge']);     !not implemented yet
    // $('initiative').text(hero['base_attr']['INI'])   !not implemented yet
    $("#encumbrance").text(hero["enc"]);

    // TODO: implement effects
}

/**
 * Returns a pseudo hero object for saving the current stats
 * @param {int} lep
 * @param {int} asp
 * @param {int} kap
 * @param {dict} wealth a dictionary
 * @returns
 */
function newHeroObject(lep, asp, kap, name, wealth) {
    let stats = {
        "lep_current": lep,
        "asp_current": asp,
        "kap_current": kap,
        "name": name,
        "wealth": wealth,
    };
    return stats;
}
