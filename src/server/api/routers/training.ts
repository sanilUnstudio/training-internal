import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const trainingRouter = createTRPCRouter({
  addNewTraining: publicProcedure
    .input(
      z.object({
        steps: z.string(),
        userId: z.string(),
        configFile_url: z.string(),
        weight_link: z.string(),
        rank: z.string(),
        hf_model_path: z.string(),
        sample_prompt: z.string(),
        trigger_word: z.string(),
        learning_rate: z.string(),
        zip_url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        steps,
        userId,
        configFile_url,
        weight_link,
        rank,
        hf_model_path,
        sample_prompt,
        trigger_word,
        learning_rate,
        zip_url,
      } = input;

      const Trained = await ctx.db.training.create({
        data: {
          zip_url: zip_url,
          steps: steps,
          learning_rate: learning_rate,
          trigger_word: trigger_word,
          sample_prompt: sample_prompt,
          rank: rank,
          hf_model_path: hf_model_path || null,
          weight_link: weight_link || null,
          configFile_url: configFile_url || null,
          userId: userId,
        },
      });

      return Trained;
    }),

  fetchAllTrainings: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const Trainings = await ctx.db.training.findMany({
        where: {
          userId: input.userId,
        },
      });
      return Trainings;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
