import { Button, styled, useTheme } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import React, { FunctionComponent, useCallback, useState } from "react";
import { ToggleIconButton } from "../../buttons/Buttons";
import { BitcoinIcon, MetamaskFoxIcon } from "../../icons/RenIcons";
import {
  BridgePaper,
  PaperActions,
  PaperContent,
  PaperHeader,
  PaperNav,
  PaperTitle,
} from "../../layout/Paper";
import {
  ProgressWithContent,
  TransactionStatusInfo,
} from "../../progress/ProgressHelpers";
import { Section } from "../PresentationHelpers";

const CenteringBox = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginBottom: 24,
});

const BigDoneIcon = styled(DoneIcon)({
  fontSize: 120,
  color: "inherit",
});

const STEPS = 3;
export const ProgressSection: FunctionComponent = () => {
  const [step, setStep] = useState(0);
  const { customColors, palette } = useTheme();
  const { orangeDark, orangeLight, skyBlue } = customColors;
  const handleNext = useCallback(() => {
    setStep((step) => (step + 1) % STEPS);
  }, []);
  return (
    <Section header="Progress Helpers">
      <BridgePaper>
        <PaperHeader>
          <PaperNav />
          <PaperTitle>Minting</PaperTitle>
          <PaperActions>
            <ToggleIconButton variant="notifications" pressed />
            <ToggleIconButton variant="settings" />
          </PaperActions>
        </PaperHeader>
        <PaperContent>
          <CenteringBox>
            <ProgressWithContent
              color={step === 2 ? orangeDark : orangeLight}
              fontSize={120}
              processing={step === 1}
            >
              {step !== 2 ? (
                <BitcoinIcon fontSize="inherit" color="inherit" />
              ) : (
                <BigDoneIcon />
              )}
            </ProgressWithContent>
          </CenteringBox>
          <CenteringBox>
            <ProgressWithContent
              color={step === 2 ? palette.primary.main : skyBlue}
              fontSize={120}
              processing={step === 1}
            >
              {step !== 2 ? (
                <TransactionStatusInfo
                  address="0x7a36479806342F7a1d663fF43A0D340b733FA764"
                  chain="Ethereum"
                />
              ) : (
                <BigDoneIcon />
              )}
            </ProgressWithContent>
          </CenteringBox>
          <CenteringBox>
            <ProgressWithContent
              color={step === 2 ? palette.primary.main : skyBlue}
              fontSize={70}
              processing={step === 1}
            >
              {step === 0 && (
                <MetamaskFoxIcon fontSize="inherit" color="inherit" />
              )}
              {step === 1 && (
                <TransactionStatusInfo
                  address="0x7a36479806342F7a1d663fF43A0D340b733FA764"
                  chain="Ethereum"
                />
              )}
              {step === 2 && <BigDoneIcon />}
            </ProgressWithContent>
          </CenteringBox>
          <CenteringBox>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleNext}
              fullWidth
            >
              Proceed
            </Button>
          </CenteringBox>
        </PaperContent>
      </BridgePaper>
    </Section>
  );
};