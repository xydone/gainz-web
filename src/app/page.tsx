import Link from "next/link";

export default function Index() {
  const links = [
    {
      description: "Get entries for a given range of time",
      url: "/entries",
    },
    {
      description: "Get statistics for intake based on period of time",
      url: "/stats",
    },
    {
      description: "Search and add food",
      url: "/search",
    },
    {
      description: "Create new food",
      url: "/food",
    },
  ];

  return (
    <div>
      <h1 className="text-center text-xl m-5">Gainz Web</h1>
      <div className="flex justify-center">
        <table className="overflow-hidden bg-[color:var(--accent)] mx-2.5 my-0 rounded-[1em] border-separate">
          <thead>
            <tr>
              <th className="p-2 bg-foreground text-left whitespace-nowrap break-words text-wrap">
                Name
              </th>
              <th className="p-2 bg-foreground text-left whitespace-nowrap break-words text-wrap">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, i) => (
              <tr key={i}>
                <td className="p-2 bg-foreground text-left whitespace-nowrap break-words text-wrap">
                  {link.description}
                </td>
                <td className="p-2 bg-foreground text-left whitespace-nowrap ">
                  <Link
                    className="no-underline hover:underline active:text-accent"
                    href={link.url}
                  >
                    {link.url}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
