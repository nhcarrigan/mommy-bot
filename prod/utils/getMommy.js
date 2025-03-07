/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { isProfane } from "no-profanity";
/**
 * Fetches a mommy quote from the API.
 * @param name - The user's name, if provided.
 * @returns The mommy quote.
 */
export const getMommy = async (name = "dear") => {
    const finalName = isProfane(name)
        ? "dear"
        : name;
    const url = `https://mommy.nhcarrigan.com/api?name=${finalName}`;
    const request = await fetch(url);
    const response = await request.text();
    return response;
};
