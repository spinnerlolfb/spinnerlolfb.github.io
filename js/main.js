(window.onload = function () {
  var e,
    a = $("html"),
    s = $(".preloader"),
    t = $(".curr_lang"),
    n = localStorage.lang,
    o = ["en", "de", "pl"],
    c = new URLSearchParams(window.location.search).get("lang"),
    l = new URLSearchParams(window.location.search).get("pop"),
    r = $(".popup_overlay"),
    i = $("#popup_window_1"),
    d = $("#popup_window_2"),
    u = $("#popup_window_3");
  if (
    ("on" === l && (i.fadeIn(), r.fadeIn()), "en" === n || "en" === c || !n)
  ) {
    for (e = 0; e < o.length; e++) a.removeClass(o[e]);
    a.addClass("en"), (n = "en");
  }
  for (p = 0; p < o.length; p++)
    if (n === o[p] || c === o[p]) {
      for (e = 0; e < o.length; e++) a.removeClass(o[e]);
      a.addClass(o[p]), (n = o[p]);
    }
  for (var _ = 0, p = 0; p < o.length; p++) n === o[p] && (_ = 1);
  0 === _ && (a.addClass("en"), (n = "en")),
    o.forEach(function (e) {
      a.removeClass(e).addClass(n);
    }),
    $('.lang_list_item[data-lang="' + n + '"]')
      .addClass("curr")
      .siblings()
      .removeClass("curr"),
    t.html($('.lang_list_item[data-lang="' + n + '"]').html()),
    setTimeout(function () {
      s.fadeOut(),
        setTimeout(function () {
          a.addClass("hide");
        }, 200);
    }, 200);
  var m = $(".start_btn");
  m.click(function () {
    m.addClass("disabled"),
      setTimeout(function () {
        (localStorage.currentSpin = "7120_spin"),
          $(".bonus_1").fadeIn(),
          r.fadeIn(),
          d.fadeIn();
      }, 6e3);
  }),
    "7120_spin" === localStorage.currentSpin &&
    ($(".bonus_1").fadeIn(), r.fadeIn(), d.fadeIn(), m.addClass("disabled")),
    "7120_game_2" === localStorage.is_game_2 &&
    (r.fadeIn(),
      d.fadeIn(),
      $("#game_1").css("display", "none"),
      $("#game_2").css("display", "block"),
      $(".bonus_1").fadeIn(),
      i.css("display", "none")),
    "7120_true" === localStorage.pre_final_step &&
    (i.css("display", "none"),
      d.css("display", "none"),
      r.css("display", "none"),
      $("#game_1").css("display", "none"),
      $("#game_2").css("display", "block"),
      $(".bonus_1").fadeIn()),
    "7120_true" === localStorage.final_step &&
    ((localStorage.is_game_2 = ""),
      (localStorage.currentSpin = ""),
      r.fadeIn(),
      u.fadeIn(),
      i.css("display", "none"),
      d.css("display", "none"),
      $("#game_1").css("display", "none"),
      $("#game_2").css("display", "block"),
      $(".bonus_1").fadeIn(),
      $("#popup_window_3 .bonus_2").fadeIn(),
      $(".scratch_outer").removeClass("used"));
}),
  $(document).ready(function () {
    var a = $(".lang_switcher"),
      s = $(".lang_list"),
      e = $(".lang_list_item"),
      t = $("html"),
      n = $(".preloader"),
      o = $(".curr_lang"),
      c = $(".popup_overlay"),
      l = $("#popup_window_1"),
      r = $("#popup_window_2"),
      i = $("#popup_window_3");
    a.click(function () {
      s.toggleClass("act");
    }),
      e.click(function () {
        n.fadeIn(),
          t.removeClass("hide"),
          setTimeout(function () {
            n.fadeOut(), t.addClass("hide");
          }, 200);
        var e = $(this).data("lang"),
          a = $(".lang_list_item")
            .map(function (e, a) {
              return $(a).data("lang");
            })
            .toArray()
            .join(" ");
        t.removeClass(a).addClass(e),
          (localStorage.lang = e),
          $('.lang_list_item[data-lang="' + e + '"]')
            .addClass("curr")
            .siblings()
            .removeClass("curr"),
          o.html($(this).html());
      }),
      $(document).mouseup(function (e) {
        a.is(e.target) || 0 !== a.has(e.target).length || s.removeClass("act");
      }),
      $("#popup_btn_1").click(function () {
        l.fadeOut(), c.fadeOut();
      }),
      $("#popup_btn_2").click(function () {
        r.fadeOut(),
          c.fadeOut(),
          $("#popup_window_2").fadeOut(),
          $("#game_1").css("display", "none"),
          $("#game_2").css("display", "block"),
          $(".page").addClass("bg"),
          $(".footer").css("marginTop", "18em"),
          $(".footer").css("transform", "translateY(-6em)"),
          (localStorage.is_game_2 = "7120_game_2");
      }),
      $("#current-year").text(new Date().getFullYear()),
      localStorage.scratch_bonus_7120 &&
      ($(".page").addClass("bg"),
        $(".footer").css("marginTop", "18em"),
        $(".footer").css("transform", "translateY(-6em)"),
        $(`.scratch_outer[data-scratch='${localStorage.scratch_bonus_7120}']`)
          .siblings()
          .addClass("scratch_outer_second_bonus")),
      $(".scratch_outer").mouseenter(function () {
        $(this).addClass("scratch_outer_hover");
      }),
      $(".scratch_outer").mouseleave(function () {
        $(this).removeClass("scratch_outer_hover"),
          $(this).find(".scratch_hover").addClass("scratch_hover_mouseleave");
      }),
      $(".scratch_outer").click(function () {
        $(this).addClass("scratch_outer_action_1");
        var e =
          $(this).find(".scratch_action").attr("src") + "?a=" + Math.random();
        $(this).find(".scratch_action").attr("src", e),
          l.css("display", "none"),
          r.css("display", "none"),
          (localStorage.is_game_2 = ""),
          (localStorage.currentSpin = ""),
          (localStorage.pre_final_step = "7120_true"),
          $(this).siblings().addClass("scratch_outer_second_bonus"),
          $(this).hasClass("scratch_outer_second_bonus") &&
          ($(this).find(".scratch_txt .x5").css("display", "none"),
            $(this).find(".scratch_txt .x10").css("display", "block"),
            $(this)
              .css("pointer-events", "none")
              .siblings()
              .css("pointer-events", "none"),
            setTimeout(function () {
              $("#popup_window_3 .bonus_2").fadeIn(), c.fadeIn(), i.fadeIn();
            }, 1500),
            (localStorage.final_step = "7120_true"));
      }),
      localStorage.scratch_bonus_7120 &&
      localStorage.scratch_bonus_7120.split(",").forEach(function (e) {
        $(`.scratch_outer[data-scratch='${e}']`).addClass("used");
      });
    var d = [];
    localStorage.scratch_bonus_7120 &&
      (d = localStorage.scratch_bonus_7120.split(",")),
      $(".scratch_outer").click(function () {
        d.push($(this).data("scratch")),
          (localStorage.scratch_bonus_7120 = d.toString());
      }),
      document
        .querySelector(".start_btn")
        .addEventListener("click", function () {
          var a = 60,
            s = 300,
            t = 60,
            n = 0,
            o = 0;
          !(function e() {
            if (35 === n)
              return (
                document
                  .querySelector(`[data-num="${o}"]`)
                  .children[0].children[0].classList.add("yellow"),
                document
                  .querySelector(`[data-num="${o}"]`)
                  .children[0].children[1].classList.add("yellow"),
                void document
                  .querySelector(`[data-num="${o}"]`)
                  .children[0].classList.add("blinker-text")
              );
            12 === o &&
              (document
                .querySelector(`[data-num="${o}"]`)
                .classList.remove("active"),
                (o = 0)),
              n++,
              1 < ++o &&
              document
                .querySelector(`[data-num="${o - 1}"]`)
                .classList.remove("active"),
              document
                .querySelector(`[data-num="${o}"]`)
                .classList.add("active"),
              setTimeout(e, a + (n / t) * (s - a));
          })();
        }),
      particlesJS("particles-js", {
        particles: {
          number: { value: 500, density: { enable: !0, value_area: 3e3 } },
          color: { value: "#ff5400" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 3 },
          },
          opacity: {
            value: 0.9,
            random: !0,
            anim: { enable: !1, speed: 1, opacity_min: 0.1, sync: !1 },
          },
          size: {
            value: 4,
            random: !0,
            anim: { enable: !0, speed: 3, size_min: 0, sync: !1 },
          },
          line_linked: {
            enable: !1,
            distance: 500,
            color: "#ffffff",
            opacity: 0.4,
            width: 2,
          },
          move: {
            enable: !0,
            speed: 7.8914764163227265,
            direction: "top",
            random: !0,
            straight: !1,
            out_mode: "out",
            bounce: !1,
            attract: { enable: !1, rotateX: 600, rotateY: 1200 },
          },
        },
        interactivity: {
          detect_on: "window",
          events: {
            onhover: { enable: !1, mode: "repulse" },
            onclick: { enable: !1, mode: "repulse" },
            resize: !0,
          },
          modes: {
            grab: { distance: 1400, line_linked: { opacity: 0.1 } },
            bubble: {
              distance: 400,
              size: 6,
              duration: 0.3,
              opacity: 1,
              speed: 3,
            },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: !0,
      });
  });
