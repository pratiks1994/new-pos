import React from "react";
import styles from "./CustomerSuggest.module.css";
import { useDispatch } from "react-redux";
import { setCustomerDetail } from "../Redux/finalOrderSlice";

function CustomerSuggest({ suggestions, setSuggestions }) {
      const dispatch = useDispatch();

      const handleClick = (data) => {
            dispatch(setCustomerDetail(data));
            setSuggestions([]);
      };

      return (
            <div className={styles.mainSuggest}>
                  {suggestions.map((suggestion, idx1) => {
                        if (!suggestion.addresses.length) {
                              return <div key={idx1} className={styles.suggestionOption} onClick={() => handleClick(suggestion)}>{`${suggestion.number}-${suggestion.name}`}</div>;
                        } else {
                              return suggestion.addresses.map((address, idx2) => {
                                    return (
                                          <div
                                                key={idx2}
                                                className={styles.suggestionOption}
                                                onClick={() =>
                                                      handleClick({
                                                            ...suggestion,
                                                            addresses: [address],
                                                      })
                                                }>{`${suggestion.number}-${suggestion.name}-${address.complete_address}-${address.landmark}`}</div>
                                    );
                              });
                        }
                  })}
            </div>
      );
}

export default CustomerSuggest;
