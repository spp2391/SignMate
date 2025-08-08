/* temhabank-N1 */
(function() {
  $(function() {
    $(".temhabank-N1[id=\'LKMdzPpn9D\']").each(function() {
      const $block = $(this);
      let isMobileMenuInitialized = false;
      let isDesktopMenuInitialized = false;
      // 모바일 메뉴 초기화
      function initMobileMenu() {
        if (isMobileMenuInitialized) return;
        const $btnMomenu = $block.find(".btn-momenu");
        $btnMomenu.off("click").on("click", function() {
          if ($block.hasClass("block-active")) {
            $block.removeClass("block-active");
          } else {
            $block.addClass("block-active");
          }
          $block.find(".header-gnbitem").removeClass("item-active");
          $block.find(".header-sublist").removeAttr("style");
        });
        // header-gnbitem 클릭 이벤트
        $block.find(".header-gnbitem").each(function() {
          const $this = $(this);
          const $thisLink = $this.find(".header-gnblink");
          const $sublist = $this.find(".header-sublist");
          if ($sublist.length) {
            $thisLink.off("click").on("click", function(event) {
              event.preventDefault();
              const $clickedItem = $(this).parents(".header-gnbitem");
              if (!$clickedItem.hasClass("item-active")) {
                $block.find(".header-gnbitem").removeClass("item-active");
                $block.find(".header-sublist").stop().slideUp(300);
              }
              $clickedItem.toggleClass("item-active");
              $sublist.stop().slideToggle(300);
            });
          }
        });
        isMobileMenuInitialized = true;
      }
      // 데스크탑 메뉴 초기화
      function initDesktopMenu() {
        if (isDesktopMenuInitialized) return;
        $block.find(".header-gnbitem").each(function() {
          const $this = $(this);
          const $thisLink = $this.find(".header-gnblink");
          $thisLink.off("click");
        });
        isDesktopMenuInitialized = true;
      }
      // 해상도에 따른 메뉴 처리
      function handleResize() {
        if (window.innerWidth <= 992) {
          if (!isMobileMenuInitialized) {
            initMobileMenu();
          }
          isDesktopMenuInitialized = false;
        } else {
          if (!isDesktopMenuInitialized) {
            initDesktopMenu();
          }
          isMobileMenuInitialized = false;
        }
      }
      // 스크롤 시 메뉴 처리
      function handleScroll() {
        const $headerTop = $block.find(".header-top");
        if ($headerTop.length) {
          $block.addClass("top-menu-active");
        }
        if ($(window).scrollTop() === 0) {
          $block.addClass("header-top-active");
        }
        $(window).scroll(function() {
          if ($(window).scrollTop() > 0) {
            $block.removeClass("header-top-active");
          } else {
            $block.addClass("header-top-active");
          }
        });
      }
      handleScroll();
      // 전체 메뉴 열기/닫기 처리
      function handleFullMenu() {
        $block.find(".btn-allmenu").on("click", function() {
          $block.find(".header-fullmenu").addClass("fullmenu-active");
        });
        $block.find(".fullmenu-close").on("click", function() {
          $block.find(".header-fullmenu").removeClass("fullmenu-active");
        });
        $block.find(".fullmenu-gnbitem").each(function() {
          const $this = $(this);
          $this.on("mouseover", function() {
            if (window.innerWidth > 992) {
              $this.find(".fullmenu-gnblink").addClass("on");
            }
          });
          $this.on("mouseout", function() {
            if (window.innerWidth > 992) {
              $this.find(".fullmenu-gnblink").removeClass("on");
            }
          });
        });
      }
      handleFullMenu();
      // 리사이즈 시마다 메뉴 동작 초기화
      $(window).on("resize", function() {
        handleResize();
      });
      handleResize();
    });
  });
})();
/* temhabank-N4 */
(function() {
  $(function() {
    $(".temhabank-N4[id=\'SKMDzPpnpV\']").each(function() {
      const $block = $(this);
      // Swiper
      $block.find(".tabset-link").click(function() {
        const $idx = $(this).parent().index();
        ["left", "center"].forEach((side) => {
          $block
            .find(`.col-${side}`)
            .eq($idx)
            .addClass("active")
            .siblings(`.col-${side}`)
            .removeClass("active");
        });
      });
      const swiper = new Swiper(".temhabank-N4[id=\'SKMDzPpnpV\'] .swiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
        },
        navigation: {
          nextEl: ".temhabank-N4[id=\'SKMDzPpnpV\'] .btn-next",
          prevEl: ".temhabank-N4[id=\'SKMDzPpnpV\'] .btn-prev",
        },
      });
      // 정지
      $block.find(".btn-pause").click(function() {
        swiper.autoplay.stop();
        $(this).removeClass("active");
        $(this).siblings(".btn-play").addClass("active");
      });
      // 재생
      $block.find(".btn-play").click(function() {
        swiper.autoplay.start();
        $(this).removeClass("active");
        $(this).siblings(".btn-pause").addClass("active");
      });
    });
  });
})();
/* temhabank-N6 */
(function() {
  $(function() {
    $(".temhabank-N6[id=\'izmDzppO1O\']").each(function() {
      const $block = $(this);
      $block.find(".btn-open").click(function() {
        $block.find(".menu-list").addClass("active");
      });
      $block.find(".btn-close").click(function() {
        $block.find(".menu-list").removeClass("active");
      });
    });
  });
})();
