(function ($) {
  "use strict";
  /*---------------quiz1-------------------- */
  $(document).ready(function () {
    var perguntas = [
      {
        pergunta: "1. Sente dor na coluna quando fica muito tempo sentado?",
        peso: 10,
      },
      {
        pergunta: "2. Sente dor na coluna quando fica muito tempo em pé?",
        peso: 10,
      },
      {
        pergunta: "3. Durante a prática de exercício sente dor na coluna?",
        peso: 10,
      },
      { pergunta: "4. Tem dor de cabeça frequente?", peso: 30 },
      { pergunta: "5. Ao abaixar ou agachar sente dor na coluna?", peso: 10 },
      {
        pergunta:
          "6. Tem sensação de rigidez na coluna ou falta de mobilidade?",
        peso: 10,
      },
      { pergunta: "7. Tem diferença na altura dos ombros?", peso: 10 },
      { pergunta: "8. Tem diferença no comprimento das pernas?", peso: 10 },
      {
        pergunta:
          "9. Foi diagnosticado com hérnia de disco, escoliose, citalgia?",
        peso: 70,
      },
      {
        pergunta: "10. Sente perda de força e/ou formigamento nos braços?",
        peso: 70,
      },
      {
        pergunta:
          "11. Sente perda de força e/ou formigamento nas pernas e pés?",
        peso: 70,
      },
    ];

    var pontuacao = 0,
      indiceAtual = 0;

    function exibirPergunta(indice) {
      if (indice >= perguntas.length) {
        exibirResultados();
        return;
      }

      var pergunta = perguntas[indice];

      var html =
        '<center><p class="text-dark" style="font-size:1.125em;">' +
        pergunta.pergunta +
        "</p>";

      html += `<div class="form-check d-flex justify-content-center">
          <input type="radio" name="resposta" value="sim" class="form-check-input mr-1 " aria-label="Resposta Quizz Sim" checked />
          <label class="form-check-label ml-4 pzin" for="flexRadioDefault1">
              Sim
          </label>
      </div>`;
      html += `<div class="form-check d-flex justify-content-center">
          <input type="radio" name="resposta" value="nao" class="form-check-input mr-1" aria-label="Resposta Quizz Não" />
          <label class="form-check-label ml-4 pzin" for="flexRadioDefault1">
              Não
          </label>
      </div>`;
      html += `<div class="form-check d-flex justify-content-center">
          <input type="radio" name="resposta" value="naosei" class="form-check-input mr-1" aria-label="Resposta Quizz Não Sei" />
          <label class="form-check-label ml-5 pzin" for="flexRadioDefault1">
              Não sei
          </label>
      </div>`;

      $(".js-quizz").html(html);

      // Atualizar barra de progresso
      var progresso = ((indiceAtual + 1) / perguntas.length) * 100;
      $(".progress-bar").css("width", progresso + "%");
      $(".progress-bar").attr("aria-valuenow", progresso);
    }

    function exibirResultados() {
      var fase, prognostico, tratamento;

      if (pontuacao >= 0 && pontuacao <= 30) {
        fase = "Normal";
        prognostico = "Tratamento preventivo";
        tratamento = "Tratamento inicial: 12 sessões";
      } else if (pontuacao > 30 && pontuacao <= 60) {
        fase = "Fase 1";
        prognostico = "Tratamento imediato";
        tratamento = "Tratamento inicial: 18 a 24 sessões";
      } else if (pontuacao > 60 && pontuacao <= 140) {
        fase = "Fase 2";
        prognostico = "Tratamento urgente";
        tratamento = "Tratamento inicial: 24 a 32 sessões";
      } else {
        fase = "Fase 3";
        prognostico = "Tratamento muito urgente";
        tratamento = "Tratamento inicial: 24 a 32 sessões";
      }

      $("#fase").text(fase);
      $("#prognostico").text(prognostico);
      $("#tratamento").text(tratamento);

      $(".js-quizz").hide();
      $("#submitBtn").hide();
      $("#result").removeClass("d-none");

      // Salvando resultado no localStorage ou cookies
      if (typeof Storage !== "undefined") {
        //localStorage.setItem("pontuacao", pontuacao);
        //localStorage.setItem("savedDate", new Date().toString());
      } else {
        document.cookie =
          "pontuacao=" +
          pontuacao +
          "; expires=" +
          setCookieExpiration(7) +
          "; path=/";
      }
    }

    function setCookieExpiration(days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      return date.toUTCString();
    }

    function calcularPontuacao() {
      $('input[name="resposta"]:checked').each(function () {
        var resposta = $(this).val();
        var peso = perguntas[indiceAtual].peso;

        console.log("resposta / peso", resposta, peso);

        if (resposta === "sim") {
          pontuacao += peso;
        } else if (resposta === "naosei") {
          pontuacao += peso / 4;
        }
      });

      console.log("pontuacao", pontuacao);
    }

    // Verificar se o resultado está salvo no localStorage
    if (typeof Storage !== "undefined" && localStorage.getItem("pontuacao")) {
      var savedDate = localStorage.getItem("savedDate");
      var currentDate = new Date();

      if (
        currentDate.getTime() - new Date(savedDate).getTime() <=
        7 * 24 * 60 * 60 * 1000
      ) {
        pontuacao = parseInt(localStorage.getItem("pontuacao"));

        indiceAtual = perguntas.length;
        // Atualizar barra de progresso
        var progresso = ((indiceAtual + 1) / perguntas.length) * 100;
        $(".progress-bar").css("width", progresso + "%");
        $(".progress-bar").attr("aria-valuenow", progresso);

        exibirResultados();
      } else {
        indiceAtual = 0;
        localStorage.removeItem("pontuacao");
        localStorage.removeItem("savedDate");
        exibirPergunta(indiceAtual);
      }
    }
    // Verificar se o resultado está salvo em cookies
    else if (document.cookie.indexOf("pontuacao=") !== -1) {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf("pontuacao=") === 0) {
          pontuacao = parseInt(cookie.substring("pontuacao=".length), 10);

          indiceAtual = perguntas.length;
          // Atualizar barra de progresso
          var progresso = ((indiceAtual + 1) / perguntas.length) * 100;
          $(".progress-bar").css("width", progresso + "%");
          $(".progress-bar").attr("aria-valuenow", progresso);

          exibirResultados();
          break;
        }
      }
    } else {
      exibirPergunta(indiceAtual);
    }

    $(document).on("click", 'input[name="resposta"]', function () {
      calcularPontuacao();

      if (indiceAtual < perguntas.length) {
        indiceAtual++;
        exibirPergunta(indiceAtual);
      } else {
        // Salvando resultado no localStorage com data de expiração
        if (typeof Storage !== "undefined") {
          localStorage.setItem("pontuacao", pontuacao);
          localStorage.setItem("savedDate", new Date().toString());
        }
        exibirResultados();
      }
    });

    $("#submitBtn").on("click", function () {
      calcularPontuacao();

      if (indiceAtual < perguntas.length) {
        indiceAtual++;
        exibirPergunta(indiceAtual);
      } else {
        // Salvando resultado no localStorage com data de expiração
        if (typeof Storage !== "undefined") {
          localStorage.setItem("pontuacao", pontuacao);
          localStorage.setItem("savedDate", new Date().toString());
        }
        exibirResultados();
      }
    });
  });
  /*---------------quiz1-------------------- */

  //Hide Loading Box (Preloader)
  function handlePreloader() {
    if ($(".loader-wrap").length) {
      $(".loader-wrap").delay(1000).fadeOut(500);
    }
  }

  if ($(".preloader-close").length) {
    $(".preloader-close").on("click", function () {
      $(".loader-wrap").delay(200).fadeOut(500);
    });
  }

  //Update Header Style and Scroll to Top
  function headerStyle() {
    if ($(".main-header").length) {
      var windowpos = $(window).scrollTop();
      var siteHeader = $(".main-header");
      var scrollLink = $(".scroll-top");
      if (windowpos >= 150) {
        siteHeader.addClass("fixed-header");
        scrollLink.addClass("open");
      } else {
        siteHeader.removeClass("fixed-header");
        scrollLink.removeClass("open");
      }
    }
  }

  headerStyle();

  //Submenu Dropdown Toggle
  if ($(".main-header li.dropdown ul").length) {
    $(".main-header .navigation li.dropdown").append(
      '<div class="dropdown-btn"><span class="fas fa-angle-down"></span></div>'
    );
  }

  //Mobile Nav Hide Show
  if ($(".mobile-menu").length) {
    $(".mobile-menu .menu-box").mCustomScrollbar();

    var mobileMenuContent = $(".main-header .menu-area .main-menu").html();
    $(".mobile-menu .menu-box .menu-outer").append(mobileMenuContent);
    $(".sticky-header .main-menu").append(mobileMenuContent);

    //Dropdown Button
    $(".mobile-menu li.dropdown .dropdown-btn").on("click", function () {
      $(this).toggleClass("open");
      $(this).prev("ul").slideToggle(500);
    });
    //Dropdown Button
    $(".mobile-menu li.dropdown .dropdown-btn").on("click", function () {
      $(this).prev(".megamenu").slideToggle(900);
    });
    //Menu Toggle Btn
    $(".mobile-nav-toggler").on("click", function () {
      $("body").addClass("mobile-menu-visible");
    });

    //Menu Toggle Btn
    $(".mobile-menu .menu-backdrop,.mobile-menu .close-btn").on(
      "click",
      function () {
        $("body").removeClass("mobile-menu-visible");
      }
    );
  }

  // Scroll to a Specific Div
  if ($(".scroll-to-target").length) {
    $(".scroll-to-target").on("click", function () {
      var target = $(this).attr("data-target");
      // animate
      $("html, body").animate(
        {
          scrollTop: $(target).offset().top,
        },
        1000
      );
    });
  }

  // Elements Animation
  if ($(".wow").length) {
    var wow = new WOW({
      mobile: false,
    });
    wow.init();
  }

  //Contact Form Validation
  if ($("#contact-form").length) {
    $("#contact-form").validate({
      rules: {
        username: {
          required: true,
        },
        email: {
          required: true,
          email: true,
        },
        phone: {
          required: true,
        },
        subject: {
          required: true,
        },
        message: {
          required: true,
        },
      },
    });
  }

  //Fact Counter + Text Count
  if ($(".count-box").length) {
    $(".count-box").appear(
      function () {
        var $t = $(this),
          n = $t.find(".count-text").attr("data-stop"),
          r = parseInt($t.find(".count-text").attr("data-speed"), 10);

        if (!$t.hasClass("counted")) {
          $t.addClass("counted");
          $({
            countNum: $t.find(".count-text").text(),
          }).animate(
            {
              countNum: n,
            },
            {
              duration: r,
              easing: "linear",
              step: function () {
                $t.find(".count-text").text(Math.floor(this.countNum));
              },
              complete: function () {
                $t.find(".count-text").text(this.countNum);
              },
            }
          );
        }
      },
      { accY: 0 }
    );
  }

  //LightBox / Fancybox
  if ($(".lightbox-image").length) {
    $(".lightbox-image").fancybox({
      openEffect: "fade",
      closeEffect: "fade",
      helpers: {
        media: {},
      },
    });
  }

  //Tabs Box
  if ($(".tabs-box").length) {
    $(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
      e.preventDefault();
      var target = $($(this).attr("data-tab"));

      if ($(target).is(":visible")) {
        return false;
      } else {
        target
          .parents(".tabs-box")
          .find(".tab-buttons")
          .find(".tab-btn")
          .removeClass("active-btn");
        $(this).addClass("active-btn");
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .fadeOut(0);
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .removeClass("active-tab");
        $(target).fadeIn(300);
        $(target).addClass("active-tab");
      }
    });
  }

  //Accordion Box
  if ($(".accordion-box").length) {
    $(".accordion-box").on("click", ".acc-btn", function () {
      var outerBox = $(this).parents(".accordion-box");
      var target = $(this).parents(".accordion");

      if ($(this).hasClass("active") !== true) {
        $(outerBox).find(".accordion .acc-btn").removeClass("active");
      }

      if ($(this).next(".acc-content").is(":visible")) {
        return false;
      } else {
        $(this).addClass("active");
        $(outerBox).children(".accordion").removeClass("active-block");
        $(outerBox).find(".accordion").children(".acc-content").slideUp(300);
        target.addClass("active-block");
        $(this).next(".acc-content").slideDown(300);
      }
    });
  }

  // banner-carousel
  if ($(".banner-carousel").length) {
    $(".banner-carousel").owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      active: true,
      smartSpeed: 1000,
      autoplay: 6000,
      navText: [
        '<span class="flaticon-left-arrow"></span>',
        '<span class="flaticon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        800: {
          items: 1,
        },
        1024: {
          items: 1,
        },
      },
    });
  }

  //three-item-carousel
  if ($(".three-item-carousel").length) {
    $(".three-item-carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      smartSpeed: 500,
      autoplay: 1000,
      navText: [
        '<span class="flaticon-left-arrow"></span>',
        '<span class="flaticon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        480: {
          items: 1,
        },
        600: {
          items: 2,
        },
        800: {
          items: 2,
        },
        1024: {
          items: 3,
        },
      },
    });
  }

  // Four Item Carousel
  if ($(".four-item-carousel").length) {
    $(".four-item-carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      smartSpeed: 500,
      autoplay: 1000,
      navText: [
        '<span class="flaticon-left-arrow"></span>',
        '<span class="flaticon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        800: {
          items: 3,
        },
        1024: {
          items: 3,
        },
        1200: {
          items: 4,
        },
      },
    });
  }

  // single-item-carousel
  if ($(".single-item-carousel").length) {
    $(".single-item-carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      smartSpeed: 3000,
      autoplay: true,
      navText: [
        '<span class="flaticon-left-arrow"></span>',
        '<span class="flaticon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        480: {
          items: 1,
        },
        600: {
          items: 1,
        },
        800: {
          items: 1,
        },
        1200: {
          items: 1,
        },
      },
    });
  }

  // clients-carousel
  if ($(".clients-carousel").length) {
    $(".clients-carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      smartSpeed: 3000,
      autoplay: true,
      navText: [
        '<span class="flaticon-left-arrow"></span>',
        '<span class="flaticon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        480: {
          items: 2,
        },
        600: {
          items: 3,
        },
        800: {
          items: 4,
        },
        1200: {
          items: 5,
        },
      },
    });
  }

  //Product Tabs
  if ($(".project-tab").length) {
    $(".project-tab .project-tab-btns .p-tab-btn").on("click", function (e) {
      e.preventDefault();
      var target = $($(this).attr("data-tab"));

      if ($(target).hasClass("actve-tab")) {
        return false;
      } else {
        $(".project-tab .project-tab-btns .p-tab-btn").removeClass(
          "active-btn"
        );
        $(this).addClass("active-btn");
        $(".project-tab .p-tabs-content .p-tab").removeClass("active-tab");
        $(target).addClass("active-tab");
      }
    });
  }

  //Add One Page nav
  if ($(".scroll-nav").length) {
    $(".scroll-nav").onePageNav();
  }

  //Sortable Masonary with Filters
  function enableMasonry() {
    if ($(".sortable-masonry").length) {
      var winDow = $(window);
      // Needed variables
      var $container = $(".sortable-masonry .items-container");
      var $filter = $(".filter-btns");

      $container.isotope({
        filter: "*",
        masonry: {
          columnWidth: ".masonry-item.small-column",
        },
        animationOptions: {
          duration: 500,
          easing: "linear",
        },
      });

      // Isotope Filter
      $filter.find("li").on("click", function () {
        var selector = $(this).attr("data-filter");

        try {
          $container.isotope({
            filter: selector,
            animationOptions: {
              duration: 500,
              easing: "linear",
              queue: false,
            },
          });
        } catch (err) {}
        return false;
      });

      winDow.on("resize", function () {
        var selector = $filter.find("li.active").attr("data-filter");

        $container.isotope({
          filter: selector,
          animationOptions: {
            duration: 500,
            easing: "linear",
            queue: false,
          },
        });
      });

      var filterItemA = $(".filter-btns li");

      filterItemA.on("click", function () {
        var $this = $(this);
        if (!$this.hasClass("active")) {
          filterItemA.removeClass("active");
          $this.addClass("active");
        }
      });
    }
  }

  enableMasonry();

  // Progress Bar
  if ($(".count-bar").length) {
    $(".count-bar").appear(
      function () {
        var el = $(this);
        var percent = el.data("percent");
        $(el).css("width", percent).addClass("counted");
      },
      { accY: -50 }
    );
  }

  // page direction
  function directionswitch() {
    if ($(".page_direction").length) {
      $(".direction_switch button").on("click", function () {
        $("body").toggleClass(function () {
          return $(this).is(".rtl, .ltr") ? "rtl ltr" : "rtl";
        });
      });
    }
  }

  /*	=========================================================================
	When document is Scrollig, do
	========================================================================== */

  jQuery(document).on("ready", function () {
    (function ($) {
      // add your functions
      directionswitch();
    })(jQuery);
  });

  /* ==========================================================================
   When document is Scrollig, do
   ========================================================================== */

  $(window).on("scroll", function () {
    headerStyle();
  });

  /* ==========================================================================
   When document is loaded, do
   ========================================================================== */

  $(window).on("load", function () {
    handlePreloader();
    enableMasonry();
  });
})(window.jQuery);
