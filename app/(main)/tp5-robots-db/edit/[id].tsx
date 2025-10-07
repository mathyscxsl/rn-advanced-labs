import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import RobotForm from "../../../../components/RobotForm";
import { useUpdateRobotMutation } from "../../../../hooks/useRobotsQuery";
import {
  getById as repoGet,
  list as repoList,
} from "../../../../services/robotRepo";
import { Robot } from "../../../../validation/robotSchema";

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<Robot | null>(null);
  const [existing, setExisting] = useState<Robot[]>([] as any);
  const [loading, setLoading] = useState(true);
  const updateMut = useUpdateRobotMutation();

  useEffect(() => {
    (async () => {
      try {
        const rows = await repoList({});
        const mapped = rows.map((r) => ({
          id: r.id,
          name: r.name,
          label: r.label,
          year: r.year as any,
          type: r.type as any,
        }));
        setExisting(mapped);
        const row = await repoGet(id);
        if (!row) throw new Error("Robot introuvable");
        setInitial({
          id: row.id,
          name: row.name,
          label: row.label,
          year: row.year as any,
          type: row.type as any,
        });
      } catch (e: any) {
        Alert.alert("Erreur", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <RobotForm
      robotId={id}
      initialValues={initial ?? undefined}
      existingRobots={existing}
      onSubmit={async (values) => {
        await updateMut.mutateAsync({ id, changes: values as any });
        router.replace("/tp5-robots-db" as any);
      }}
      onSubmitSuccess={() => {}}
    />
  );
}
