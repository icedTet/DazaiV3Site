import { useRouter } from 'next/router';
import { useState } from 'react';
import { fetcher } from '../../../utils/discordFetcher';
import { getGuildShardURL } from '../../../utils/ShardLib';
import {
  CardType,
  rarityGradientMap,
  rarityWordMap,
} from '../../../utils/types';
import { Modal } from '../../Modal';

export interface Card {
  cardID: string;
  id: string;
  card: CardType;
  amount: number;
}

export const InventoryCardRenderer = (props: {
  card: Card;
  selected?: boolean;
}) => {
  const { card, cardID, id, amount } = props.card;
  const [modalOpen, setmodalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  return (
    <>
      <div
        className={`flex flex-col gap-1 p-2 ${
          props.selected && `bg-indigo-700/40`
        } rounded-3xl hover:bg-transparent transition-all`}
      >
        {/* <span className={`text-gray-50/40 w-fit font-wsans font-medium`}>
          {props.selected ? `Selected` : <>&nbsp;</>}
        </span> */}
        <div
          className={`card rounded-2xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 bg-gradient-to-r ${
            rarityGradientMap[card.rarity]
          } animate-gradient p-1 overflow-hidden shrink-0 ${
            !props.selected && `opacity-75`
          }`}
          //   onClick={() => {
          //     setViewingCard(card);
          //     setCreateCard(false);
          //   }}
          onClick={() => setmodalOpen(true)}
          key={`card-inventory-${card._id}`}
        >
          {!!(amount - 1) && (
            <div
              className={`absolute z-10 bottom-2 right-2 p-2 bg-gray-900/70 backdrop-blur-sm w-12 h-8 flex flex-row items-center justify-center rounded-xl text-sm font-medium font-wsans`}
            >
              x{amount}
            </div>
          )}

          <img
            src={card.url}
            alt=''
            className={`w-[17.75rem] h-[6.64rem] object-cover z-10 transition-all pointer-events-none brightness-75 group-hover:brightness-100 ease-in duration-200 rounded-2xl`}
          />
        </div>
      </div>
      <Modal visible={modalOpen} onClose={() => setmodalOpen(false)} hideBG>
        <div className={`relative h-[576px] aspect-[400/576] scale-150`}>
          <div
            className={`absolute w-full h-full rounded-3xl bg-gradient-to-br z-20 ${
              rarityGradientMap[card.rarity]
            } leading-loose opacity-5`}
          />
          <div
            className={`absolute w-full h-full rounded-3xl bg-gradient-to-r z-0 ${
              rarityGradientMap[card.rarity]
            } animate-gradient-medium leading-loose blur-lg opacity-50`}
          />
          <div
            className={`absolute w-full h-full rounded-3xl bg-gradient-to-br z-10 from-gray-750 to-gray-900  leading-loose`}
          />
          <div
            className={`absolute w-full h-full rounded-3xl bg-gradient-to-br z-10 opacity-5 overflow-hidden`}
          >
            <img
              src={card.url}
              alt=''
              className={`w-auto h-full object-cover z-10 rounded-3xl pointer-events-none blur-sm`}
            />
          </div>
          <div
            className={`flex absolute flex-col p-8 justify-between gap-6 h-full w-full rounded-3xl border-gray-100/10 ${
              updating && `opacity-50 pointer-events-none`
            } transition-all z-30`}
          >
            <div className={`flex flex-col gap-4 flex-grow`}>
              <div
                className={`flex flex-row justify-between items-center -mt-2 mb-2`}
              >
                <span
                  className={`text-xl font-wsans font-extrabold uppercase bg-gradient-to-r ${
                    rarityGradientMap[card.rarity]
                  } animate-gradient-medium leading-loose bg-clip-text text-transparent `}
                >
                  {rarityWordMap[card.rarity]}
                </span>
                {!!(amount - 1) && (
                  <div
                    className={`bg-black px-6 p-1 rounded-full flex flex-row font-wsans font-bold text-sm items-center gap-2 text-white`}
                  >
                    Owned:{' '}
                    <div
                      className={`font-extrabold bg-gradient-to-r ${
                        rarityGradientMap[card.rarity]
                      } animate-gradient-medium leading-loose bg-clip-text text-transparent`}
                    >
                      {`x${amount}`}
                    </div>
                  </div>
                )}
              </div>
              <div className={`flex items-center gap-4 w-full justify-between`}>
                <h1 className={`text-2xl font-poppins font-extrabold`}>
                  {card.name}
                </h1>
              </div>
              <div className={`flex flex-col justify-center items-center`}>
                <div
                  className={`card rounded-3xl shadow-lg w-fit p-1.5 relative overflow-hidden shrink-0 z-10`}
                >
                  <img
                    src={card.url}
                    alt=''
                    className={`w-full h-auto object-cover z-10 rounded-3xl pointer-events-none`}
                  />
                  <div
                    className={`bg-gradient-to-r ${
                      rarityGradientMap[card.rarity]
                    } animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
                  />
                </div>
              </div>
              <span
                className={`text-gray-400 font-wsans text-xs p-4 bg-gray-900/50 flex-grow rounded-2xl`}
              >
                {card.description}
              </span>
            </div>
            <div
              className={`flex flex-row gap-4 justify-between w-full items-center`}
            >
              <span className={`text-gray-500 font-wsans text-xs`}>
                Card ID: {card._id as string}
              </span>
              <button
                className={`rounded-full px-6 py-1.5 w-fit text-sm bg-gray-100 text-gray-850 font-bold flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all disabled:opacity-50 disabled:pointer-events-none`}
                onClick={async () => {
                  if (updating) return;
                  setUpdating(true);
                  const res = await fetcher(
                    `${await getGuildShardURL(
                      router.query.guild as string
                    )}/guilds/${router.query.guild}/inventory/selectCard`,
                    {
                      method: 'POST',
                      body: JSON.stringify({
                        cardID: id,
                      }),
                    }
                  );
                  setUpdating(false);
                  if (res.status === 200) {
                    router.replace(router.asPath);
                  }
                }}
                disabled={updating || props.selected}
              >
                {props.selected ? `SELECTED` : `SELECT`}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
