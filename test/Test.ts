import assert from "assert";
import { 
  TestHelpers,
  EventsSummaryEntity,
  L2ArbitrumToken_TransferEntity
} from "generated";
const { MockDb, L2ArbitrumToken, Addresses } = TestHelpers;

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  l2ArbitrumToken_TransferCount: BigInt(0),
};

describe("L2ArbitrumToken contract Transfer event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock L2ArbitrumToken contract Transfer event
  const mockL2ArbitrumTokenTransferEvent = L2ArbitrumToken.Transfer.createMockEvent({
    from: Addresses.defaultAddress,
    to: Addresses.defaultAddress,
    value: 0n,
    data: "foo",
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = L2ArbitrumToken.Transfer.processEvent({
    event: mockL2ArbitrumTokenTransferEvent,
    mockDb: mockDbFinal,
  });

  it("L2ArbitrumToken_TransferEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualL2ArbitrumTokenTransferEntity = mockDbUpdated.entities.L2ArbitrumToken_Transfer.get(
      mockL2ArbitrumTokenTransferEvent.transactionHash +
        mockL2ArbitrumTokenTransferEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedL2ArbitrumTokenTransferEntity: L2ArbitrumToken_TransferEntity = {
      id:
        mockL2ArbitrumTokenTransferEvent.transactionHash +
        mockL2ArbitrumTokenTransferEvent.logIndex.toString(),
      from: mockL2ArbitrumTokenTransferEvent.params.from,
      to: mockL2ArbitrumTokenTransferEvent.params.to,
      value: mockL2ArbitrumTokenTransferEvent.params.value,
      data: mockL2ArbitrumTokenTransferEvent.params.data,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualL2ArbitrumTokenTransferEntity, expectedL2ArbitrumTokenTransferEntity, "Actual L2ArbitrumTokenTransferEntity should be the same as the expectedL2ArbitrumTokenTransferEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      l2ArbitrumToken_TransferCount: MOCK_EVENTS_SUMMARY_ENTITY.l2ArbitrumToken_TransferCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual L2ArbitrumTokenTransferEntity should be the same as the expectedL2ArbitrumTokenTransferEntity");
  });
});
