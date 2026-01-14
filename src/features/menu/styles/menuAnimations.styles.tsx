export const MenuAnimations = () => (
  <style jsx global>{`
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideOutLeft {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-100%);
      }
    }

    @keyframes slideInFromLeft {
      from {
        opacity: 0;
        transform: translateX(-100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInFromTop {
      from {
        opacity: 0;
        transform: translateY(-50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInFromLeftNoFade {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes slideInFromRightNoFade {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes slideInFromRightDrawer {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes slideInFromRightButton {
      from {
        opacity: 0;
        transform: translateX(100px) translateY(-50%);
      }
      to {
        opacity: 1;
        transform: translateX(0) translateY(-50%);
      }
    }

    @keyframes slideOutToRightButton {
      from {
        opacity: 1;
        transform: translateX(0) translateY(-50%);
      }
      to {
        opacity: 0;
        transform: translateX(100px) translateY(-50%);
      }
    }
  `}</style>
);

