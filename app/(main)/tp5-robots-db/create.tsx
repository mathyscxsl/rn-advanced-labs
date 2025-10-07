import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import RobotForm from "../../../components/RobotForm";
import { useCreateRobotMutation } from "../../../hooks/useRobotsQuery";
import { list as repoList } from "../../../services/robotRepo";
import { Robot } from "../../../validation/robotSchema";

export default function CreateRobotScreen() {
  const router = useRouter();
  const [existing, setExisting] = useState<Robot[]>([] as any);
  const createMut = useCreateRobotMutation();

  useEffect(() => {
    (async () => {
      const rows = await repoList({});
      const mapped = rows.map((r) => ({
        id: r.id,
        name: r.name,
        label: r.label,
        year: r.year as any,
        type: r.type as any,
      }));
      setExisting(mapped);
    })();
  }, []);

  return (
    <RobotForm
      existingRobots={existing}
      onSubmit={async (values) => {
        const id = uuidv4();
        await createMut.mutateAsync({
          id,
          name: values.name,
          label: values.label,
          year: values.year as any,
          type: values.type as any,
        });
        router.replace("/tp5-robots-db" as any);
      }}
      onSubmitSuccess={() => {}}
    />
  );
}
