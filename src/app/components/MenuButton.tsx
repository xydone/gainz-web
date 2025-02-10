export default function MenuButton({toggleNav}) {
  return (

    <div className="mr-[1em] inline-flex sm:hidden">
    <button className="cursor-pointer border-0 background-none" onClick={toggleNav}>
      <svg
      className="fill-[black] dark:fill-[white]"
        xmlns="http://www.w3.org/2000/svg"
        width="29"
        height="29"
        viewBox="0 -960 960 960"
        ><path d="M120-240v-80h720v80zm0-200v-80h720v80zm0-200v-80h720v80z"
        ></path></svg>
    </button>
  </div>
  );
}