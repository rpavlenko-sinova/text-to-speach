import { sendToBackground } from '@plasmohq/messaging';
import { useStorage } from '@plasmohq/storage/hook';

type TButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const CountButton = ({ onClick = () => {}, disabled = false }: TButtonProps) => {
  const [count, setCount] = useStorage<number>('count', 0);

  const increment = async () => {
    const newCount = count + 1;
    setCount(newCount);

    await sendToBackground({
      name: 'iconCount',
      body: { count: newCount },
    });

    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={increment}
      type="button"
      disabled={disabled}
      className="flex flex-row items-center rounded-lg border-none bg-slate-50 px-4 py-2 text-sm text-slate-800 shadow-lg transition-all hover:bg-slate-100 hover:text-slate-900 hover:shadow-md active:scale-105"
    >
      Count:
      <span className="ml-2 inline-flex h-4 w-8 items-center justify-center rounded-full text-xs font-semibold">
        {count}
      </span>
    </button>
  );
};
