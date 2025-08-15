import React from "react";
import { OutputBox } from "@/components/OutputBox";
import { prisma } from "@/lib/prisma";
import InputBox from "@/components/InputBox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

const QuestionPage = async ({ params }: { params: { questionId: string } }) => {
  const { questionId } = await params;
  const question = await prisma?.question?.findUnique({
    where: {
      id: questionId,
    },
    include: {
      submissions: true,
    },
  });

  return (
    <div className="">
      <div>
        <div className="text-right">
          {
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-3" />
              </TooltipTrigger>
              <TooltipContent className="max-w-40">
                Output is based on the info you provided including desired job
                title, job description, resume, etc.
              </TooltipContent>
            </Tooltip>
          }
        </div>
      </div>
      <div className="flex flex-col justify-around xl:flex-row gap-10 mt-10">
        <OutputBox questionId={params.questionId} question={question} />

        <InputBox questionId={params.questionId} />
      </div>
    </div>
  );
};

export default QuestionPage;
