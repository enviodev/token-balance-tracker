/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import { L2ArbitrumTokenContract, userEntity } from "generated";

const USER_ENTITY: userEntity = {
  id: "INITIAL",
  balance: BigInt(0),
};

L2ArbitrumTokenContract.Transfer.loader(({ event, context }) => {
  context.User.load(event.params.from.toString());
  context.User.load(event.params.to.toString());
});

L2ArbitrumTokenContract.Transfer.handler(({ event, context }) => {
  let userFromAddress = event.params.from.toString();
  let userToAddress = event.params.to.toString();

  let currentUserFrom = context.User.get(userFromAddress) ?? USER_ENTITY;
  let currentUserTo = context.User.get(userToAddress) ?? USER_ENTITY;

  const nextUserFromEntity = {
    ...currentUserFrom,
    id: userFromAddress,
    balance: currentUserFrom.balance - event.params.value,
  };

  const nextUserToEntity = {
    ...currentUserTo,
    id: userToAddress,
    balance: currentUserTo.balance + event.params.value,
  };

  context.User.set(nextUserFromEntity);
  context.User.set(nextUserToEntity);
});
