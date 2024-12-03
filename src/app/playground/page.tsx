"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronsUpDownIcon, SendHorizonalIcon } from "lucide-react";
import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Markdown from "react-markdown";

import { env } from "@/env.mjs";
import { reactClient } from "@/trpc/react";
import { useAuth } from "../_components/providers";

export default function Example() {
  const auth = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const [text, setText] = useState("");
  const [chats, setChats] = useState<Array<ChatCompletionMessageParam>>([]);
  const models = reactClient.model.getActiveChatModels.useQuery();
  const keys = reactClient.core.getApiKeys.useQuery();
  const first_key = keys.data?.[0]?.key ?? "";
  const client = useMemo(() => {
    return new OpenAI({
      baseURL: env.NEXT_PUBLIC_HUB_API_ENDPOINT + "/v1",
      apiKey: first_key,
      dangerouslyAllowBrowser: true,
    });
  }, [first_key]);
  const current_model = selected ?? models.data?.[0]?.name ?? null;
  const trigger = useCallback(
    async (chat: string, chatlog: typeof chats) => {
      if (!current_model) return;
      setText("");
      setIsloading(true);
      setChats((c) => [...c, { role: "user", content: chat }]);
      const stream = await client.chat.completions.create({
        stream: true,
        messages: [...chatlog, { role: "user", content: chat }],
        model: current_model,
        max_tokens: 1024,
      });
      setChats((c) => [...c, { role: "assistant", content: "" }]);
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        setChats((c) => {
          const cc = structuredClone(c);
          cc[cc.length - 1]!.content =
            ((cc[cc.length - 1]?.content as string) ?? "") + content;
          return cc;
        });
      }
      setIsloading(false);
    },
    [client, current_model],
  );

  if (auth.status === "UNAUTHED") {
    router.push("/sign-in");
  }

  if (keys.data?.length === 0) {
    return (
      <div>
        Looks like you dont have any api keys! Go make one and come back
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-full max-h-full max-w-2xl flex-grow flex-col justify-between gap-1 overflow-hidden px-5 pb-4 pt-12">
      <div>
        <Listbox value={current_model} onChange={setSelected}>
          <Label className="block text-sm/6 font-medium text-gray-900">
            Model
          </Label>
          <div className="relative mt-2">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600 sm:text-sm/6">
              <span className="block truncate">
                {models.isLoading ? "Loading..." : current_model}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDownIcon
                  aria-hidden="true"
                  className="size-5 text-gray-400"
                />
              </span>
            </ListboxButton>

            <ListboxOptions
              transition
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
            >
              {models.data?.map((model) => (
                <ListboxOption
                  key={model.name}
                  value={model.name}
                  className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-orange-600 data-[focus]:text-white"
                >
                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {model.name}
                  </span>

                  <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-orange-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                    <CheckIcon aria-hidden="true" className="size-5" />
                  </span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
      {/* We use h-0 to trick flex into overflow scrolling when it hits max h
        after growing from flex
        */}
      <div className="relative h-0 flex-grow">
        <div className="relative h-full overflow-y-scroll">
          <ul className="grid grid-cols-1 space-y-5">
            {chats.map((c, i) => (
              <div
                key={i}
                className={`${c.role === "user" ? "place-self-end" : "place-self-start"} space-y-2`}
              >
                <div className={`rounded-2xl bg-white px-5`}>
                  <Markdown>{c.content as string}</Markdown>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Chat
        </label>
        <div className="my-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            id="comment"
            name="comment"
            rows={3}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm/6"
          />
        </div>
        <button
          onClick={() => trigger(text, chats)}
          disabled={isLoading}
          type="button"
          className="align-center inline-flex w-full items-center justify-center gap-3 rounded-md bg-orange-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Send Chat
          <SendHorizonalIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
/*
 * */
