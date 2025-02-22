import React from "react";

import { RouteKey } from "~/subApps/builder/constants";

import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import PageHeader from "../../../components/PageHeader";
import PageSubHeader from "../../../components/PageSubHeader";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

class AbilityScoresHelp extends React.PureComponent {
  render() {
    return (
      <Page>
        <PageBody>
          <PageHeader>Determine Ability Scores</PageHeader>
          <p>
            Much of what your character does in the game depends on their six
            abilities: <strong>Strength</strong>, <strong>Dexterity</strong>,{" "}
            <strong>Constitution</strong>, <strong>Intelligence</strong>,{" "}
            <strong>Wisdom</strong>, and <strong>Charisma</strong>. Each ability
            has a score, which is a number you record for use during play.
          </p>

          <PageHeader>Generation Method</PageHeader>
          <p>
            You can determine ability scores in one of three ways, chosen in the
            next step:
          </p>

          <PageSubHeader>Standard Array</PageSubHeader>
          <p>
            If you want to save time or don’t like the idea of randomly
            determining ability scores, you can choose from a fixed list (15,
            14, 13, 12, 10, 8).
          </p>

          <PageSubHeader>Manual or Random Generation</PageSubHeader>
          <p>
            Manually enter your ability scores. If you roll to randomly
            determine scores, choose this option to record your results. The
            standard method is to roll 4d6 and drop the lowest dice roll for
            each score. This system is used when you select Roll in the Manual
            category.
          </p>

          <PageSubHeader>Point Cost</PageSubHeader>
          <p>
            Customize your ability scores by spending points. If you are playing
            an Adventurers League character, choose this option. You have 27
            points to spend on your ability scores. The cost of each score is
            shown on the Ability Score Point Costs table. For example, a score
            of 14 costs 7 of your 27 points.
          </p>

          <h5>Ability Score Point Costs</h5>
          <table
            className="table-compendium"
            style={
              {
                maxWidth: "420px",
                "--sb-table-row-bg-hover": "#b3d3df",
                "--sb-table-row-bg-dark": "#d7e8ee",
                "--sb-table-row-bg-light": "#f1f7f9",
                "--dark-sb-table-row-bg-light": "#5e7982",
                "--dark-sb-table-row-bg-dark": "#5c7f8c",
                "--dark-sb-table-row-bg-hover": "#78a2b0",
              } as React.CSSProperties
            }
          >
            <thead>
              <tr>
                <th>Score</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>8</td>
                <td>0</td>
              </tr>
              <tr>
                <td>9</td>
                <td>1</td>
              </tr>
              <tr>
                <td>10</td>
                <td>2</td>
              </tr>
              <tr>
                <td>11</td>
                <td>3</td>
              </tr>
              <tr>
                <td>12</td>
                <td>4</td>
              </tr>
              <tr>
                <td>13</td>
                <td>5</td>
              </tr>
              <tr>
                <td>14</td>
                <td>7</td>
              </tr>
              <tr>
                <td>15</td>
                <td>9</td>
              </tr>
            </tbody>
          </table>
        </PageBody>
      </Page>
    );
  }
}

export default ConnectedBuilderPage(
  AbilityScoresHelp,
  RouteKey.ABILITY_SCORES_HELP
);
