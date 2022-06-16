import { Committee, CommitteeAssignment, Person, SolverOptions } from "src/api";
import { CommitteeSet } from "src/Model/CommitteeSet";
import { UNDEFINED_SOLUTION } from "src/Model/Defaults";
import { Solution } from "src/Model/Solution";
import {
  BASE_MODEL,
  CORE_MODEL,
  FOLLOW_UP_MODEL,
  MAIN_MODEL,
  RECIPROCITY_MODEL,
} from "./clingo_constants";

const certifyMatch = /certify\((.+),(.+)\)/;
const scheduleMatch = /schedule\((.+),(.+)\)/;

/**
 * It takes an array of objects with a name property and returns an object with the same objects, but
 * indexed by the sanitized name
 * @param {SolverOptions} options - SolverOptions
 * @returns An object with the sanitized name as the key and the person as the value.
 */
const indexParticipantsBySanitizedName = (options: SolverOptions) => {
  const participants: { [name: string]: Person } = {};
  if (options.participants) {
    options.participants.forEach((p) => {
      participants[sanitizeName(p.name)] = p;
    });
  }
  return participants;
};

export const buildSolution = (
  options: SolverOptions,
  result: ClingoResult
): Solution => {
  if (result.Result === "ERROR") {
    const badSolution = UNDEFINED_SOLUTION;
    badSolution.solverStatus = result.Result;
    badSolution.scoreExplanation = result.Error;
    return badSolution;
  }
  const values = result.Call[0].Witnesses[0].Value;

  // Indexing the participants by sanitized name
  const participants = indexParticipantsBySanitizedName(options);

  // Creating the assignments
  const assignments: Array<CommitteeAssignment> = values
    .filter((item) => item.startsWith("certify"))
    .map((item) => {
      const names = item.match(certifyMatch);
      const assignedPersonName = names ? names[1] : "";
      const evaluatedPersonName = names ? names[2] : "";
      const assignedPerson = participants[assignedPersonName];
      const evaluatedPerson = participants[evaluatedPersonName];
      const committee = {
        id: evaluatedPersonName,
        evaluatedPerson,
      } as Committee;
      return { assignedPerson, committee } as CommitteeAssignment;
    });
  const committees = CommitteeSet.fromAssignments(assignments);
  return new Solution(
    assignments,
    committees,
    result.Result,
    "",
    JSON.stringify(result, null, 2)
  );
};

export interface ClingoResult {
  Solver?: string;
  Calls: number;
  Call: { Witnesses: { Value: string[] }[] }[];
  Models: {
    More: "yes" | "no";
    Number: number;
    Brave?: "yes" | "no";
    Consequences?: any;
  };
  Result: "SATISFIABLE" | "UNSATISFIABLE" | "ERROR";
  Error: string;
  Time: {
    CPU: number;
    Model: number;
    Solve: number;
    Total: number;
    Unsat: number;
  };

  Warnings: string[];
}

const sanitizeName = (name: string | undefined): string => {
  return name ? name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";
};

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const PARTICIPANTS_MODEL = (options: SolverOptions): string => {
  let participantsModel = "";
  if (options.participants) {
    // Indexing the participants by sanitized name
    const participants = indexParticipantsBySanitizedName(options);

    // Shuffling the participants if needed
    const shuffledParticipants = options.settings?.shuffleParticipants
      ? (shuffleArray(options.participants) as Array<Person>)
      : options.participants;

    for (const person of shuffledParticipants) {
      if (person.name) {
        const name = sanitizeName(person.name);
        // To simplify everybody has joined at year 0
        participantsModel += `joined(${name}, 0).`;
        const party =
          person.personType?.name === "professional" ? "first" : "second";
        participantsModel += `attribute(core, ${name}, party, ${party}).`;
        if (person.needsEvaluation) {
          participantsModel += `attribute(core, ${name}, needsEvaluation, true).`;
        }
        if (person.vetoes) {
          for (const veto of person.vetoes) {
            participantsModel += `attribute(core, ${name}, veto, ${sanitizeName(
              veto.name
            )}).`;
          }
        }
        if (person.availability) {
          for (const timeSlot of person.availability) {
            participantsModel += `attribute(committeeMeeting, ${name}, availableOn, ${sanitizeName(
              timeSlot.name
            )}).`;
          }
        }
        if (person.skills) {
          for (const skill of person.skills) {
            participantsModel += `attribute(skills, ${name}, provides, ${sanitizeName(
              skill.name
            )}).`;
          }
        }
        if (person.languages) {
          for (const language of person.languages) {
            participantsModel += `attribute(communication, ${name}, speaks, ${sanitizeName(
              language.name
            )}).`;
          }
        }
        if (person.location) {
          participantsModel += `attribute(location, ${name}, basedIn, ${sanitizeName(
            person.location.name
          )}).`;
        }
        if (person.hasAlreadyInspected) {
          for (let i = 0; i < person.hasAlreadyInspected.length; i++) {
            const pseudoYear = person.hasAlreadyInspected.length - i - 1;
            for (const evaluated of person.hasAlreadyInspected[i]) {
              // we need to check if the evaluated person has not left the party because clingo says it is bad data
              const sanitizedEvaluatedName = sanitizeName(evaluated);
              if (participants[sanitizedEvaluatedName]) {
                participantsModel += `attribute(followUp, ${name}, certified(${pseudoYear}), ${sanitizedEvaluatedName}).`;
              }
            }
          }
        }
      }
    }
  }

  return participantsModel;
};

export const buildModel = (options: SolverOptions): string => {
  // Identifying the targets, at first it was years but now it starts from 0 to the last, so we have to check the history of the committees
  let historySize = 0;
  if (options.participants) {
    for (const person of options.participants) {
      const personHistorySize: number = person.hasAlreadyInspected?.length || 0;
      historySize = Math.max(historySize, personHistorySize);
    }
  }
  const followUpTo = historySize > 1 ? historySize - 1 : 0;
  return (
    MAIN_MODEL(historySize) +
    CORE_MODEL +
    RECIPROCITY_MODEL +
    FOLLOW_UP_MODEL(followUpTo) +
    BASE_MODEL +
    PARTICIPANTS_MODEL(options)
  );
};
