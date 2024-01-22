import ResultCard from "./ResultCard";
import { Result } from "../utils/types";

function ResultContainer({ result }: { result: Result[] }) {
    // TODO: deal with no results
    return (
      <div className="grid gap-4">
        {result.map((item) => (
          <ResultCard
            key={item.dataset_uuid}
            nodeName={item.node_name}
            datasetName={item.dataset_name}
            datasetTotalSubjects={item.dataset_total_subjects}
            numMatchingSubjects={item.num_matching_subjects}
            imageModals={item.image_modals}
          />
        ))}
      </div>
    );
  }

export default ResultContainer;