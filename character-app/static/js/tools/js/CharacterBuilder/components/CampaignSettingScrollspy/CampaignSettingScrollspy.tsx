import { Box, Button } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";

interface CampaignSettingScrollspyProps {
  children?: ReactNode;
  childSelector: string;
  parentSelector: string;
  selectedClass?: string;
  preselectedSettingId: number | null;
}

export const CampaignSettingScrollspy = ({
  children,
  childSelector,
  parentSelector,
  selectedClass = "",
  preselectedSettingId,
}: CampaignSettingScrollspyProps) => {
  const [row, setRow] = useState(1);
  const [cards, setCards] = useState<NodeListOf<Element>>();

  const handleScroll = () => {
    const dialog = document.querySelector(parentSelector);

    cards?.forEach((card, i) => {
      if (card instanceof HTMLElement) {
        const top = card.offsetTop;
        const bottom = top + card.offsetHeight;

        if (
          dialog &&
          dialog.scrollTop - 50 < top &&
          dialog.scrollTop + window.innerHeight > bottom
        ) {
          setRow(i + 1);
        }
      }
    });
  };

  const handleSmoothScroll = (id: string) => {
    const dialog = document.querySelector(parentSelector);

    if (dialog) {
      const card = document.querySelector(`#${id}`) as HTMLElement;
      const dest = card?.offsetTop;

      // REVISIT THIS LATER. SMOOTH SCROLLING NOT WORKING IN CHROME
      dialog.scrollTo({ top: dest, behavior: "smooth" });
    }
  };

  const getSelected = (row: number) => {
    const allCards = document.querySelectorAll(childSelector);
    let selected = 0;
    allCards.forEach((card, i) => {
      if (card.classList.contains(selectedClass)) {
        selected = i + 1;
      }
    });

    const selectedRow = Math.ceil(selected / getRows("number"));

    return row === selectedRow;
  };

  const getRows = (type: "selector" | "number") => {
    const mq = window.innerWidth;
    let math;
    if (type === "selector") {
      math =
        mq >= 1200
          ? ":nth-child(3n - 2)"
          : mq >= 900
          ? ":nth-child(2n - 1)"
          : "";
    } else {
      math = mq >= 1200 ? 3 : mq >= 900 ? 2 : 1;
    }
    return math;
  };

  useEffect(() => {
    const cardElements = () => {
      const elements = document.querySelectorAll(
        `${childSelector}${getRows("selector")}`
      );
      setCards(elements);
    };
    cardElements();
    // HANDLE SCREEN RESIZE
    window.addEventListener("resize", cardElements);
    return () => {
      window.addEventListener("resize", cardElements);
    };
  }, [preselectedSettingId]);

  useEffect(() => {
    // CREATE/DESTROY SCROLL LISTENER
    const dialog = document.querySelector(parentSelector);
    dialog?.addEventListener("scroll", handleScroll);

    return () => {
      dialog?.removeEventListener("scroll", handleScroll);
    };
  }, [cards]);

  return (
    <>
      {children}
      <Box
        component="ul"
        sx={{
          color: "white",
          position: "fixed",
          top: 0,
          bottom: 0,
          right: { xs: 15, lg: 30 },
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 0,
        }}
      >
        {cards &&
          Array.from(cards).map((el, i) => (
            <Box
              component="li"
              key={el.id}
              sx={{
                "&:not(:last-child):after": {
                  content: '""',
                  display: "block",
                  width: "50%",
                  borderRight: "2px solid white",
                  height: "20px",
                  mt: 0,
                  mb: 0,
                  ml: "1px",
                  opacity: 0.1,
                },
              }}
            >
              <Button
                onClick={() => handleSmoothScroll(el.id)}
                sx={{
                  opacity: i + 1 === row ? 1 : 0.4,
                  p: "2px",
                  my: 1,
                  minWidth: 0,
                  border: getSelected(i + 1)
                    ? "1px solid white"
                    : "1px solid transparent",
                  borderRadius: "50%",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    height: 12,
                    width: 12,
                    background: "white",
                    borderRadius: "50%",
                    m: "1px",
                  }}
                />
              </Button>
            </Box>
          ))}
      </Box>
    </>
  );
};
