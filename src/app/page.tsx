"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
});

export default function Home() {
  const [isloading, setIsloading] = useState(true);
  const [succuss, setSuccess] = useState("");
  const [data, setData] = useState<any>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const response = await axios.post(
        "/api/task",
        {
          name: values.name,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setSuccess("Task has ben created successfully");
      }
      reset();
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchData() {
    try {
      const response = await axios.get("/api/task");

      if (response.status === 200) {
        setIsloading(false);
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTask(id: number) {
    try {
      const response = await axios.delete("/api/task", {
        data: {
          id,
        },
      });
      if (response.status === 200) {
        setSuccess("Task has ben deleted successfully");
      }
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  });
  return (
    <section className="bg-slate-950 h-screen flex flex-col items-center justify-center p-4 text-white gap-2">
      <h1 className="text-[50px] font-semibold">TODO_LIST</h1>
      <form
        className="bg-slate-600 p-4 rounded-md w-full max-w-md flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="_name">Name</label>
          <input
            className="w-full bg-slate-500 p-2 rounded-md border-none ring-1 ring-white focus:ring-2 outline-none duration-200"
            type="text"
            {...register("name")}
            id="_name"
          />
        </div>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {succuss && <p className="text-green-500">{succuss}</p>}
        <input
          className="bg-slate-900 p-2 rounded-md hover:bg-slate-800 cursor-pointer duration-200"
          type="submit"
          value={"Add Task"}
        />
        <div className="flex flex-col gap-2 text-center">
          {isloading ? (
            <p>Loading...</p>
          ) : (
            <>
              {data &&
                data.map((item: any) => {
                  return (
                    <>
                      <section className="w-full flex items-center justify-center gap-4">
                        <p
                          className="w-full p-2 bg-slate-500 hover:bg-slate-400 rounded-md duration-200"
                          key={item.id}
                        >
                          {item.name}
                        </p>
                        <div
                          onClick={() => deleteTask(item.id)}
                          className="bg-red-500 hover:bg-red-600 duration-200 w-[50px] h-full flex items-center justify-center cursor-pointer rounded-md"
                        >
                          <Trash2 />
                        </div>
                      </section>
                    </>
                  );
                })}
            </>
          )}
        </div>
      </form>
    </section>
  );
}
