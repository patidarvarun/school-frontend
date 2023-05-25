import { useFieldArray, useForm } from "react-hook-form";

type FormValues = {
  cart: {
    name: string;
    amount: number;
  }[];
};



export default function App() {
  const { register, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      cart: [
        { name: "Stghdth", amount: 0 },
        { name: "Stghdth", amount: 0 }
      ]
    }
  });
  const { fields, remove } = useFieldArray({
    name: "cart",
    control
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          console.log("Submit data", data);
        })}
      >
        {fields.map((field, index) => {
          return (
            <section key={field.id}>
              <label>
                <input
                  {...register(`cart.${index}.name`, { required: true })}
                />
              </label>
              <label>
                <input
                  type="number"
                  {...register(`cart.${index}.amount`, { valueAsNumber: true })}
                />
              </label>
              <button type="button" onClick={() => remove(index)}>
                Delete
              </button>
            </section>
          );
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}









